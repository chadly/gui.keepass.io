angular.module("keepass.io").config(function ($httpProvider) {
	$httpProvider.interceptors.push(["$q", "notify", function ($q, notify) {
		return {
			responseError: function (response) {
				if (response.status === 500) {
					notify.error("There was an error trying to complete the current request. Please refresh the page and try again.");
				}

				if (response.status === 401) {
					notify.error("The specified master password is not valid. Please try again.");
				}

				return $q.reject(response);
			}
		};
	}]);
});