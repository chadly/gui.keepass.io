var api = require("./api"),
    portal = require("./portal");

exports.init = function (app) {
	api.init(app);
    portal.init(app);
};