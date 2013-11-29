angular.module("keepass.io").controller("HomeCtrl", function ($scope, $rootScope, $http) {
	$rootScope.cssScope = "kp-home";

	$http.get("/api").success(function (response) {
		$scope.databases = response.databases;
	});
});