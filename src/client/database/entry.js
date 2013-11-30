angular.module("keepass.io").controller("DatabaseEntryCtrl", function ($scope) {
	var entry = $scope.selectedEntry();
	//angular.copy freezes here…
	for (var prop in entry) {
		$scope[prop] = entry[prop];
	}
});