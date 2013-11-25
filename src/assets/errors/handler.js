angular.module("keepass.io").config(function ($httpProvider) {
	$httpProvider.responseInterceptors.push(["$q", "notify", function ($q, notify) {
		return function (promise) {
			return promise.then(success, error);
		};

		function success(response) {
			return response;
		}

		function error(response) {
			if (response.status === 500) {
				notify.error("There was an error trying to complete the current request. Please refresh the page and try again.");
			}

			return $q.reject(response);
		}
	}]);
});