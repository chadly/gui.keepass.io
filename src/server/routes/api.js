var Keepass = require("keepass.io"),
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
		var db = new Keepass();

		db.setCredentials({
			password: req.body.password
		});

		db.load(path.join(dbPath, req.params.name), function (err, data) {
			if (err) {
				if (err.name === "CredentialsError") {
					res.status(401).send(err.message);
					return;
				}

				return next(err);
			}

			res.send(transform(data));
		});
	});

	function transform(database) {
		//only return what the UI is going to use
		return populate(database, {
			name: database.meta.dbName,
			description: database.meta.dbDescription
		});
	}

	function populate(src, dest) {
		var groups = [];

		for (var groupId in src.groups) {
			var srcGroup = src.groups[groupId];

			var destGroup = {
				id: groupId,
				name: srcGroup.name,
				notes: srcGroup.notes
			};

			destGroup.entries = [];
			for (var entryId in srcGroup.entries) {
				var srcEntry = srcGroup.entries[entryId];
				destGroup.entries.push({
					id: entryId,
					title: srcEntry.title,
					url: srcEntry.url,
					username: srcEntry.username,
					password: srcEntry.password,
					lastModificationTime: srcEntry.lastModificationTime,
					notes: srcEntry.notes,
					fields: srcEntry.fields
				});
			}

			populate(srcGroup, destGroup);

			groups.push(destGroup);
		}

		if (groups.length > 0) {
			dest.groups = groups;
		}

		return dest;
	}
};