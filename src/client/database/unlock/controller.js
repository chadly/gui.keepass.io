angular.module("keepass.io").controller("DatabaseUnlockCtrl", function ($scope, $rootScope, $routeParams, database, $location) {
	$rootScope.title = $routeParams.name;
	$rootScope.cssScope = "kp-unlock";

	$scope.unlockDatabase = function () {
		$scope.isUnlocking = true;

		database.unlock($routeParams.name, this.masterPassword).then(function (data) {
			var id = $scope.redirectId || data.groups[0].id;
			$location.path("/" + $routeParams.name + "/" + id);
		}.bind(this)).finally(function () {
			$scope.isUnlocking = false;
		});
	};
});