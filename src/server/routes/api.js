var Keepass = require("keepass.io"),
    path = require("path"),
    glob = require("glob");

exports.init = function (app) {
	var dbPath = app.get("databasePath");

	app.get("/api/", function (req, res) {
		glob(path.join(dbPath, "/*.kdbx"), function (err, files) {
			if (err) throw err;

			res.send({
				databases: files.map(function (file) {
					return path.relative(dbPath, file).replace(/.kdbx/g, "");
				})
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