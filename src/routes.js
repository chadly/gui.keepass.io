exports.init = function (app) {
	//this controller handles all UI requests and serves up our single page

	app.get("/", handleRequest);

	function handleRequest(req, res) {
		res.render("index");
	}
};