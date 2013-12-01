angular.module("keepass.io").controller("DatabaseEntryCtrl", function ($scope) {
	var entry = $scope.selectedItem;

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