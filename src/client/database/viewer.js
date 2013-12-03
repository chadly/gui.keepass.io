angular.module("keepass.io").controller("DatabaseViewerCtrl", function ($scope, $rootScope) {
	$rootScope.cssScope = "kp-viewer";

	$rootScope.title = $scope.database.name;
	$rootScope.description = $scope.database.description;

	$scope.groups = $scope.database.groups;

	$scope.$watch("selectedItem", function () {
		$scope.breadcrumbs = [];

		var item = $scope.selectedItem;
		while (item) {
			$scope.breadcrumbs.push(item);
			item = item.parent;
		}

		$scope.breadcrumbs.reverse();
	});

	processGroups($scope.groups);

	function processGroups(groups, parent) {
		if (groups) {
			groups.forEach(function (group) {
				group.parent = parent;

				group.entries.forEach(function (entry) {
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

	$scope.select = function (item) {
		$scope.selectedItem = item;
	};

	$scope.isSelected = function (item) {
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