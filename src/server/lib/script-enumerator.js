var glob = require("glob"),
	path = require("path");

//creates script tags for scripts in assets folder
module.exports = function (folder) {
	return function (req, res, next) {
		glob(path.join(folder, "/**/*.js"), {
			cwd: folder
		}, function (err, files) {
			if (err) throw err;

			res.locals.scripts = "";

			files.forEach(function (file) {
				if (file.indexOf("test") < 0) {
					file = path.join("/assets/", path.relative(folder, file)).replace(/\\/g, "/");

					var scriptTag = '<script src="' + file + '"></script>';

					if (file.indexOf("app.js") >= 0) {
						res.locals.scripts = scriptTag + "\n" + res.locals.scripts;
					} else {
						res.locals.scripts += "\n" + scriptTag;
					}
				}
			});

			next();
		});
	};
};