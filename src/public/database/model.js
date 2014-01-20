angular.module("keepass.io").service("database", function ($http, $q) {
	var cache = {};

	this.unlock = function (name, masterPassword) {
		if (cache[name]) {
			return cache[name];
		}

		var deferred = $q.defer();
		cache[name] = deferred.promise;

		deferred.promise.catch(function () {
			//remove promise from cache, allow it to hit server again
			delete cache[name];
		});

		if (masterPassword) {
			$http.post("/api/" + name, {
				password: masterPassword
			}).success(deferred.resolve).error(deferred.reject);
		} else {
			deferred.reject("PasswordRequired");
		}

		return cache[name];
	};

	this.lock = function (name) {
		delete cache[name];
	};
});