var app = require("./app");

app.listen(app.get("port"), function () {
	console.log("Now listening on port " + app.get("port"));
});