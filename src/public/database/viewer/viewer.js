angular.module("keepass.io").controller("DatabaseViewerCtrl", function ($scope, $rootScope, $routeParams, $location, database) {
	$rootScope.cssScope = "kp-viewer";
	$rootScope.redirectId = $routeParams.id;

	database.unlock($routeParams.type, $routeParams.name).then(function onSuccess(data) {
		$rootScope.title = data.name;
		$rootScope.description = data.description;

		$scope.groups = data.groups;
		processGroups($scope.groups);

		function processGroups(groups, parent) {
			if (groups) {
				groups.forEach(function (group) {
					if (group.id === $routeParams.id) {
						$scope.selectedItem = group;
					}

					group.parent = parent;

					group.entries.forEach(function (entry) {
						if (entry.id === $routeParams.id) {
							$scope.selectedItem = entry;
						}

						entry.parent = group;
						entry.isEntry = true;

						if (entry.url && entry.url.indexOf("http") !== 0) {
							entry.url = "http://" + entry.url;
						}
					});

					processGroups(group.groups, group);
				});
			}
		}
	}, function onError() {
		$location.path($routeParams.type + "/" + $routeParams.name);
	});

	$scope.$watch("selectedItem", function () {
		$scope.breadcrumbs = [];

		var item = $scope.selectedItem;
		while (item) {
			$scope.breadcrumbs.push(item);
			item = item.parent;
		}

		$scope.breadcrumbs.reverse();
	});

	$scope.isSelected = function (item) {
		if (!item) {
			return false;
		}

		if ($scope.selectedItem === item) {
			return true;
		}

		if ($scope.selectedItem) {
			var currentItem = $scope.selectedItem.parent;
			while (currentItem) {
				if (currentItem === item) {
					return true;
				}
				currentItem = currentItem.parent;
			}
		}

		return false;
	};
});