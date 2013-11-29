angular.module("keepass.io").controller("DatabaseCtrl", function ($scope, $rootScope, $routeParams, $http) {
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

			$rootScope.cssScope = "kp-viewer";
			$rootScope.title = data.name;
			$scope.description = data.description;
		}.bind(this)).finally(function () {
			$scope.isUnlocking = false;
		});
	};

	$scope.select = function (group) {
		deselectAllGroups($scope.database.groups);
		group.isSelected = true;
	};

	function deselectAllGroups(groups) {
		if (groups) {
			groups.forEach(function (group) {
				group.isSelected = false;
				deselectAllGroups(group.groups);
			});
		}
	}
});