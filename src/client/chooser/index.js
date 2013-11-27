angular.module("keepass.io").controller("ChooserCtrl", function ($scope, $http) {
	$http.get("/api").success(function (response) {
		$scope.databases = response.databases;
	});
});