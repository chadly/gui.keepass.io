var express = require("express"),
	http = require("http"),
	path = require("path"),
	routes = require("./routes"),
	scriptEnumerator = require("./lib/script-enumerator"),
	optional = require("optional"),
	config = optional("./../config.json") || {};

var assetsDir = path.join(__dirname + "/../client");

var app = express();
module.exports = app;

app.configure(function () {
	app.set("port", config.port || 1337);
	app.set("databasePath", config.databasePath || path.join(__dirname + "/../../databases"));
	app.set("debug", !!config.debug);

	app.locals({
		title: "Keepass Web GUI",
		debug: app.get("debug")
	});
});

app.configure(function () {
	app.set("views", __dirname + "/views");
	app.set("view engine", "vash");

	app.use(express.favicon());

	app.use(express.logger("dev"));

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard cat" }));

	app.use("/assets", express.static(assetsDir));

	app.use(scriptEnumerator(assetsDir));
	app.use(app.router);

	app.use(function logErrors(err, req, res, next) {
		console.error(err ? err.stack || err : err);
		next(err);
	});

	app.use(express.errorHandler());
});

routes.init(app);