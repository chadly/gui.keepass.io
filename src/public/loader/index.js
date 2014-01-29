angular.module("keepass.io").controller("LoaderCtrl", function ($scope, $rootScope, $routeParams, $http, $location) {
	$rootScope.cssScope = "kp-home";

	$scope.type = $routeParams.type;

	$http.get("/api/" + $routeParams.type).success(function (response) {
		$scope.databases = response.databases;

		if ($scope.databases.length === 1) {
			$location.path($routeParams.type + "/" + $scope.databases[0].name);
		}
	});
});