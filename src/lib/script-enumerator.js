var glob = require("glob"),
	path = require("path");

//creates script tags for scripts in assets folder
module.exports = function (folder) {
	return function (req, res, next) {
		glob("**/*.js", {
			cwd: folder
		}, function (err, files) {
			if (err) throw err;

			res.locals.scripts = "";

			files.forEach(function (file) {
				if (!isExcluded(file)) {
					file = path.join("/assets/", file).replace(/\\/g, "/");

					var scriptTag = '<script src="' + file + '"></script>';

					if (file.indexOf("jquery.js") < 0 && file.indexOf("angular.js") < 0) {
						//jquery and angular are included manually

						if (file.indexOf("app.js") >= 0) {
							res.locals.scripts = scriptTag + "\n" + res.locals.scripts;
						} else {
							res.locals.scripts += "\n" + scriptTag;
						}
					}
				}
			});

			next();
		});
	};
};

function isExcluded(file) {
	if (file.indexOf("test") >= 0) {
		return true;
	}

	if (file.indexOf("ngapp") >= 0) {
		return true;
	}

	if (file.indexOf("ngtemplates") >= 0) {
		return true;
	}

	return false;
}