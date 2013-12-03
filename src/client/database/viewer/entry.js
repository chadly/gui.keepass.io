angular.module("keepass.io").controller("DatabaseEntryCtrl", function ($scope) {
	$scope.$watch("selectedItem", function populateScope(entry) {
		for (var prop in entry) {
			if (prop === "fields") {
				$scope[prop] = [];
				for (var fieldProp in entry[prop]) {
					$scope[prop].push({
						key: fieldProp,
						value: entry[prop][fieldProp]
					});
				}
			} else {
				$scope[prop] = entry[prop];
			}
		}
	});
});