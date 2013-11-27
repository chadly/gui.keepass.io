angular.module("keepass.io").controller("ViewerCtrl", function ($scope, $rootScope, $routeParams, $http) {
	$rootScope.title = $routeParams.name + " Database";
});