var express = require("express"),
	http = require("http"),
	path = require("path"),
	hogan = require("hogan-express"),
	routes = require("./routes"),
	scriptEnumerator = require("./lib/script-enumerator");

var assetsDir = path.join(__dirname + "/assets");

var app = express();

app.configure(function () {
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

http.createServer(app).listen(1337, function () {
	console.log("Express server listening on port 1337");
});

process.on("uncaughtException", function (err) {
	console.error(err ? err.stack || err : err);
});