var Keepass = require("keepass.io"),
	path = require("path"),
	glob = require("glob"),
	fs = require("fs"),
	flow = require("nimble");

exports.init = function (app) {
	var dbPath = app.get("databasePath");

	app.get("/api", function (req, res) {
		glob(path.join(dbPath, "/*.kdbx"), function (err, files) {
			if (err) throw err;

			flow.map(files, function (file, done) {
				var name = path.relative(dbPath, file).replace(/.kdbx/g, "");

				fs.stat(file, function (err, stats) {
					if (err) throw err;

					done(null, {
						name: name,
						size: stats.size,
						modifiedOn: stats.mtime
					});
				});
			}, function (err, result) {
				if (err) throw err;

				res.send({
					databases: result
				});
			});
		});
	});

	app.get("/api/:name", function (req, res) {
		var db = new Keepass();

		db.setCredentials({
			password: req.query.password
		});

		db.load(path.join(dbPath, req.params.name + ".kdbx"), function (err, data) {
			if (err) throw err;
			res.send(data);
		});
	});
};