angular.module("keepass.io").controller("ChooserCtrl", function ($scope, $rootScope, $http) {
	$rootScope.cssScope = "kp-chooser";

	$http.get("/api").success(function (response) {
		$scope.databases = response.databases;
	});
});