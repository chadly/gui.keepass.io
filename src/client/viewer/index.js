angular.module("keepass.io").controller("ViewerCtrl", function ($scope, $rootScope, $routeParams, $http) {
	$rootScope.title = $routeParams.name;
	$rootScope.cssScope = "kp-unlock";

	$scope.unlockDatabase = function () {
		$http.post("/api/" + $routeParams.name, {
			password: this.masterPassword
		}).success(function (data) {
			console.log(data);
		});
	};
});