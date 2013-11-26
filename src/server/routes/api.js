var Keepass = require("keepass.io"),
    path = require("path"),
    glob = require("glob");

exports.init = function (app) {
	app.get("/api/:folder", function (req, res) {
		var folderPath = path.join(app.get("databasePath"), req.params.folder);

		glob(path.join(folderPath, "/*.kdbx"), function (err, files) {
			if (err) throw err;

			res.send({
				databases: files.map(function (file) {
					return path.relative(folderPath, file).replace(/.kdbx/g, "");
				})
			});
		});
	});

	app.get("/api/:folder/:name", function (req, res) {
		var db = new Keepass();

		db.setCredentials({
			password: req.query.password
		});

		db.load(path.join(app.get("databasePath"), req.params.folder, req.params.name + ".kdbx"), function (err, data) {
			if (err) throw err;
			res.send(data);
		});
	});
};