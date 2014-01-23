exports.init = function (app) {
	var loaders = require("./../loaders").init(app);

	app.get("/api", function (req, res) {
		var items = [];

		for (var type in loaders) {
			items.push({
				name: loaders[type].name,
				type: type
			});
		}

		res.send(items);
	});

	app.get("/api/:type", function (req, res, next) {
		var loader = loaders[req.params.type];
		if (!loader) {
			return res.status(404).send("Could not find loader of type: " + req.params.type);
		}

		loader.list().then(function (result) {
			res.send({
				databases: result
			});
		}).catch(function (err) {
			next(err);
		});
	});

	app.post("/api/:type/:name", function (req, res, next) {
		var loader = loaders[req.params.type];
		if (!loader) {
			return res.status(404).send("Could not find loader of type: " + req.params.type);
		}

		loader.load(req.params.name, req.body.password).then(function (data) {
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