angular.module("keepass.io").controller("LoaderCtrl", function ($scope, $rootScope, $routeParams, $http) {
	$rootScope.cssScope = "kp-home";

	$scope.type = $routeParams.type;

	$http.get("/api/" + $routeParams.type).success(function (response) {
		$scope.databases = response.databases;
	});
});