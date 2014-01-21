var api = require("./api"),
	gdrive = require("./gdrive"),
    portal = require("./portal");

exports.init = function (app) {
	api.init(app);
	gdrive.init(app);
	portal.init(app);
};