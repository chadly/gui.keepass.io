var google = require("googleapis");

exports.init = function (app) {
	var gconfig = app.get("google");
	var auth = new google.OAuth2Client(gconfig.client_id, gconfig.client_secret, "http://app.keepass.io/gdrive/auth"); //TODO: get hostname from config

	app.get("/gdrive/install", function (req, res) {
		var url = auth.generateAuthUrl({
			scope: "https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file"
		});
		res.redirect(url);
	});

	app.get("/gdrive/auth", function (req, res, next) {
		if (req.session.gdriveState) {
			loadAccessTokenAndRedirect(req, res, next);
		} else {
			auth.getToken(req.query.code, function (err, tokens) {
				if (err) return next(err);
				res.redirect("http://drive.google.com/");
			});
		}
	});

	app.get("/gdrive", loadAccessTokenAndRedirect);

	function loadAccessTokenAndRedirect(req, res, next) {
		var state = req.query.state ? JSON.parse(req.query.state) : req.session.gdriveState;

		if (!req.query.code) {
			req.session.gdriveState = state;

			var url = auth.generateAuthUrl({
				scope: "https://www.googleapis.com/auth/drive.file",
				login_hint: state.userId
			});
			return res.redirect(url);
		}

		auth.getToken(req.query.code, function (err, tokens) {
			req.session.gdriveTokens = tokens;
			res.redirect("/gdrive/" + state.ids[0]);
		});
	}
};