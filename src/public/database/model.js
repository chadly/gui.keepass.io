angular.module("keepass.io").service("database", function ($http, $q) {
	var cache = {};

	this.unlock = function (type, name, masterPassword) {
		var key = cacheKey(type, name);
		
		if (cache[key]) {
			return cache[key];
		}

		var deferred = $q.defer();
		cache[key] = deferred.promise;

		deferred.promise.catch(function () {
			//remove promise from cache, allow it to hit server again
			delete cache[key];
		});

		if (masterPassword) {
			$http.post("/api/" + key, {
				password: masterPassword
			}).success(deferred.resolve).error(deferred.reject);
		} else {
			deferred.reject("PasswordRequired");
		}

		return cache[key];
	};

	this.lock = function (type, name) {
		delete cache[cacheKey(type, name)];
	};

	function cacheKey(type, name) {
		return type + "/" + name;
	}
});