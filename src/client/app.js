angular.module("keepass.io", ["ngRoute"]).config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when("/", {
			controller: "HomeCtrl",
			templateUrl: "/assets/home/index.html",
			title: "Choose your database"
		})
		.when("/:name", {
			controller: "DatabaseUnlockCtrl",
			templateUrl: "/assets/database/unlock.html",
			title: "Database Unlocker"
		})
		.otherwise({
			templateUrl: "/assets/errors/404.html",
			title: "Page Not Found"
		});
});