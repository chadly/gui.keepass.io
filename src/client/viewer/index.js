angular.module("keepass.io").controller("ViewerCtrl", function ($scope, $rootScope, $routeParams, $http) {
	$rootScope.title = $routeParams.name;
	$rootScope.cssScope = "kp-unlock";

	$scope.unlockDatabase = function () {
		$scope.isUnlocking = true;

		$http.post("/api/" + $routeParams.name, {
			password: this.masterPassword
		}).success(function (data) {
			//don't keep this thing hanging around in memory
			this.masterPassword = "";

			$scope.database = data;

			$rootScope.title = data.name;
			$scope.description = data.description;
		}.bind(this)).finally(function () {
			$scope.isUnlocking = false;
		});
	};
});