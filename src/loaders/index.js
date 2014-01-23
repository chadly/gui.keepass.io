var fs = require("fs");

//load and initialize all loaders in this folder
exports.init = function (app) {
	var result = {};

	fs.readdirSync(__dirname).forEach(function (file) {
		if (file !== "index.js" && file.indexOf(".js") > 0) {
			var name = file.slice(0, -3); //slice off .js extension
			result[name] = require("./" + file).init(app);
		}
	});

	return result;
};