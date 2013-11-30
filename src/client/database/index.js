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

	$scope.select = function (item) {
		deselectAll($scope.database.groups);
		item.isSelected = true;

		if (!item.entries) {
			//this is an entry, also select the parent group
			var group = findGroupFor($scope.database.groups, item);
			group.isSelected = true;
		}
	};

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