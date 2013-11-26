//https://groups.google.com/d/msg/angular/xG-zIC-xBXE/lNTMpxI_fB8J
angular.module("keepass.io").run(function ($rootScope) {
	$rootScope.$on("$routeChangeSuccess", function (event, route) {
		$rootScope.title = route.title;
	});
});