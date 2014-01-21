exports.init = function (app) {
	//this controller handles all UI requests and serves up our single page app

	app.get("/", handleRequest);
	app.get("/:type", handleRequest);
	app.get("/:type/:name", handleRequest);
	app.get("/:type/:name/:id", handleRequest);

	function handleRequest(req, res) {
		res.render("index");
	}
};