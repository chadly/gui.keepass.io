var express = require("express"),
	http = require("http"),
	path = require("path"),
	hogan = require("hogan-express"),
	routes = require("./routes"),
	scriptEnumerator = require("./lib/script-enumerator"),
	config = require("./../../config");

var assetsDir = path.join(__dirname + "/../client");

var app = express();

app.configure(function () {
	app.set("port", config.port || 1337);
	app.set("databasePath", config.databasePath || path.join(__dirname + "/../../databases"));

	app.locals({
		title: "Keepass Web GUI"
	});
});

app.configure(function () {
	app.set("views", __dirname + "/views");
	app.set("view engine", "html");
	app.engine("html", hogan);

	app.use(express.favicon());

	app.use(express.logger("dev"));

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard cat" }));

	app.use(scriptEnumerator(assetsDir));
	app.use(app.router);

	app.use("/assets", express.static(assetsDir));

	app.use(express.errorHandler());
});

routes.init(app);

http.createServer(app).listen(app.get("port"), function () {
	console.log("Now listening on port " + app.get("port"));
});

process.on("uncaughtException", function (err) {
	console.error(err ? err.stack || err : err);
});