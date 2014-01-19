var app = require("./app"),
	https = require("https"),
	pem = require("pem");

pem.createCertificate({
	days: 1,
	selfSigned: true
}, function (err, keys) {
	https.createServer({
		key: keys.serviceKey,
		cert: keys.certificate
	}, app).listen(app.get("port"), function () {
		console.log("Now listening on port " + app.get("port"));
	});
});