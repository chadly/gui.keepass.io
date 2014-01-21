var decryptor = require("./../lib/decryptor"),
	Q = require("q"),
	google = require("googleapis"),
	https = require("https"),
	url = require("url");

exports.init = function (config) {
	var gconfig = config.get("google");
	var auth = new google.OAuth2Client(gconfig.client_id, gconfig.client_secret);

	return {
		name: "Google Drive",
		list: function () {
			var deferred = Q.defer();
			deferred.resolve("http://drive.google.com/");
			return deferred.promise;
		},
		load: function (name, password, opts) {
			var deferred = Q.defer();

			if (!opts.gdriveTokens) {
				defered.reject({
					name: "CredentialsError",
					message: "No access tokens were supplied"
				});
			} else {
				auth.setCredentials(opts.gdriveTokens);

				google.discover("drive", "v2").execute(function (err, client) {
					if (err) return deferred.reject(err);

					client.drive.files.get({
						fileId: name
					}).withAuthClient(auth).execute(function (err, result) {
						if (err) return deferred.reject(err);

						console.log("download from: " + result.downloadUrl);

						var httpOpts = url.parse(result.downloadUrl);
						httpOpts.headers = {
							"Authorization": "Bearer " + opts.gdriveTokens.access_token
						};

						https.get(httpOpts, function (res) {
							var buffers = [];

							res.on("data", function (data) {
								buffers.push(data);
							});

							res.on("end", function () {
								var buffer = Buffer.concat(buffers);
								decryptor.decrypt(buffer, password).then(deferred.resolve, deferred.reject);
							});
						}).on("error", deferred.reject);
					});
				});
			}

			return deferred.promise;
		}
	};
};