var Keepass = require("keepass.io"),
    config = require("./../config"),
    path = require("path");

exports.init = function (app) {
	app.get("/api/:folder/:name", function (req, res) {
        var db = new Keepass();

        db.setCredentials({
            password: req.query.password
        });

        db.load(path.join(config.databasePath, req.params.folder, req.params.name + ".kdbx"), function(err, data) {
            if(err) throw err;
            res.send(data);
        });
	});
};