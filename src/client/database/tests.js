//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Controller", function () {
	var expect = chai.expect, ctrl, scope;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();

		ctrl = $controller("DatabaseCtrl", {
			$scope: scope,
			$routeParams: {
				name: "test-name"
			}
		});
	}));

	describe("when creating new instance of controller", function () {
		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
		});

		it("should set scope title", function () {
			expect(scope.title).to.equal("test-name");
		});
	});

	describe("when unlocking database", function () {
		var http;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;
			scope.masterPassword = "my voice is my passport";
			scope.unlockDatabase();
		}));

		it("should indicate activity", function () {
			expect(scope.isUnlocking).to.be.true;
		});

		describe("with an invalid password response", function () {
			beforeEach(function () {
				http.expectPOST("/api/test-name", {
					password: scope.masterPassword
				}).respond(401);

				http.flush();
			});

			it("should have posted master password to server", function () {
				http.verifyNoOutstandingExpectation();
			});

			it("should not indicate activity", function () {
				expect(scope.isUnlocking).not.to.be.ok;
			});

			it("should not clear master password", function () {
				expect(scope.masterPassword).to.equal("my voice is my passport");
			});
		});

		describe("with a successful server response", function () {
			beforeEach(function () {
				http.expectPOST("/api/test-name", {
					password: scope.masterPassword
				}).respond(200, JSON.stringify({
					name: "Test Database",
					description: "This is a test database"
				}));

				http.flush();
			});

			it("should have posted master password to server", function () {
				http.verifyNoOutstandingExpectation();
			});

			it("should not indicate activity", function () {
				expect(scope.isUnlocking).not.to.be.ok;
			});

			it("should clear master password", function () {
				expect(scope.masterPassword).not.to.be.ok;
			});

			it("should populate database data from server", function () {
				expect(scope.database).not.to.be.undefined;
				expect(scope.database.name).to.equal("Test Database");
			});

			it("should populate title from database data", function () {
				expect(scope.title).to.equal("Test Database");
			});

			it("should populate description from database data", function () {
				expect(scope.description).to.equal("This is a test database");
			});
		});
	});
});