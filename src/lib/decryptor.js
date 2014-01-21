var Keepass = require("keepass.io"),
	Q = require("q");

exports.decrypt = function (buffer, password) {
	var db = new Keepass();

	db.setCredentials({
		password: password
	});

	var deferred = Q.defer();

	//TODO: open issue with keepass.io to support ability to load from buffer directly
	//meanwhile using some private methods on the class
	db._setLoading(true);

	db._setCallback(function (err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(transform(data));
		}
	});

	db._setFileBuffer(buffer);
	db._readSignature();

	return deferred.promise;
};

function transform(database) {
	//only return subset of data
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
			id: sanitize(groupId),
			name: srcGroup.name,
			notes: srcGroup.notes
		};

		destGroup.entries = [];
		for (var entryId in srcGroup.entries) {
			var srcEntry = srcGroup.entries[entryId];
			destGroup.entries.push({
				id: sanitize(entryId),
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

function sanitize(id) {
	return id.replace(/\//g, "--").replace(/\+/g, "__");
}