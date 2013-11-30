angular.module("keepass.io").controller("DatabaseViewerCtrl", function ($scope, $rootScope) {
	$rootScope.cssScope = "kp-viewer";

	$rootScope.title = $scope.database.name;
	$rootScope.description = $scope.database.description;

	$scope.groups = $scope.database.groups;
	processGroups($scope.groups);

	function processGroups(groups, parent) {
		if (groups) {
			groups.forEach(function (group) {
				group.parent = parent;

				group.entries.forEach(function (entry) {
					entry.parent = group;
				});

				processGroups(group.groups, group);
			});
		}
	}

	$scope.select = function (item) {
		deselectAll($scope.database.groups);
		item.isSelected = true;

		if (!item.entries) {
			//this is an entry, also select the parent group
			var group = findGroupFor($scope.database.groups, item);
			group.isSelected = true;
		}
	};

	//TODO: select sets a selected observable

	$scope.selectedEntry = function () {
		return findSelectedEntry($scope.database.groups);
	};

	function findSelectedEntry(groups) {
		for (var index in groups) {
			var group = groups[index];

			for (var entryIndex in group.entries) {
				var entry = groups[index].entries[entryIndex];
				if (entry.isSelected) {
					return entry;
				}
			}

			var foundEntry = findSelectedEntry(group.groups);
			if (foundEntry) {
				return foundEntry;
			}
		}
	}

	function deselectAll(groups) {
		if (groups) {
			groups.forEach(function (group) {
				group.isSelected = false;

				group.entries.forEach(function (entry) {
					entry.isSelected = false;
				});

				deselectAll(group.groups);
			});
		}
	}

	function findGroupFor(groups, entry) {
		if (groups) {
			for (var index in groups) {
				var group = groups[index];

				for (var entryIndex in group.entries) {
					if (groups[index].entries[entryIndex] === entry) {
						return group;
					}
				}

				var foundGroup = findGroupFor(group.groups, entry);
				if (foundGroup) {
					return foundGroup;
				}
			}
		}
	}
});