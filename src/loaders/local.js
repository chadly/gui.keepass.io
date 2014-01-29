var decryptor = require("./../lib/decryptor"),
	path = require("path"),
	glob = require("glob"),
	Q = require("q"),
	flow = require("nimble"),
	fs = require("fs"),
	readFile = Q.denodeify(fs.readFile);

exports.init = function (config) {
	var basePath = config.get("databasePath");

	return {
		name: "Local Databases",
		list: function () {
			var deferred = Q.defer();

			glob(path.join(basePath, "/*.kdbx"), function (err, files) {
				if (err) return deferred.reject(err);

				flow.map(files, function (file, done) {
					var name = path.relative(basePath, file);

					fs.stat(file, function (err, stats) {
						if (err) return done(err);

						done(null, {
							name: name,
							size: stats.size,
							modifiedOn: stats.mtime
						});
					});
				}, function (err, result) {
					if (err) return deferred.reject(err);
					deferred.resolve(result);
				});
			});

			return deferred.promise;
		},
		load: function (name, password) {
			var dbPath = path.join(basePath, name);

			var deferred = Q.defer();

			fs.exists(dbPath, function (exists) {
				if (!exists) {
					deferred.reject({
						name: "NotFound",
						message: "Could not find database file on disk"
					});
				}

				readFile(dbPath).then(function (stream) {
					return decryptor.decrypt(stream, password);
				}, function (err) {
					deferred.reject(err);
				}).then(deferred.resolve, deferred.reject);
			});

			return deferred.promise;
		}
	};
};