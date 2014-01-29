var database = require("./../lib/decryptor"),
	path = require("path"),
	glob = require("glob"),
	fs = require("fs"),
	flow = require("nimble");

exports.init = function (app) {
	var dbPath = app.get("databasePath");

	app.get("/api", function (req, res, next) {
		glob(path.join(dbPath, "/*.kdbx"), function (err, files) {
			if (err) return next(err);

			flow.map(files, function (file, done) {
				var name = path.relative(dbPath, file);

				fs.stat(file, function (err, stats) {
					if (err) return next(err);

					done(null, {
						name: name,
						size: stats.size,
						modifiedOn: stats.mtime
					});
				});
			}, function (err, result) {
				if (err) return next(err);

				res.send({
					databases: result
				});
			});
		});
	});

	app.post("/api/:name", function (req, res, next) {
		database.decrypt(path.join(dbPath, req.params.name), req.body.password).then(function (data) {
			res.send(data);
		}).catch(function (err) {
			if (err.name === "CredentialsError") {
				res.status(401).send(err.message);
			} else {
				next(err);
			}
		});
	});
};