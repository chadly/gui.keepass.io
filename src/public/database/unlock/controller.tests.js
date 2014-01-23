//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Unlock Controller", function () {
	var expect = chai.expect, ctrl, scope, location, databaseMock;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller, $location, $q) {
		scope = $rootScope.$new();
		location = $location;

		databaseMock = {
			unlock: function () {
				this.deferred = $q.defer();
				return this.deferred.promise;
			}
		};

		ctrl = $controller("DatabaseUnlockCtrl", {
			$scope: scope,
			database: databaseMock,
			$routeParams: {
				name: "test-name",
				type: "local"
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
		beforeEach(angular.mock.inject(function () {
			scope.masterPassword = "my voice is my passport";
			scope.unlockDatabase();
		}));

		it("should indicate activity", function () {
			expect(scope.isUnlocking).to.be.true;
		});

		describe("with an invalid-password server response", function () {
			beforeEach(function () {
				scope.$apply(function () {
					databaseMock.deferred.reject();
				});
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
				scope.$apply(function () {
					databaseMock.deferred.resolve({
						name: "Test Database",
						description: "This is a test database",
						groups: [{
							id: "1234",
							name: "Test Group"
						}]
					});
				});
			});

			it("should not indicate activity", function () {
				expect(scope.isUnlocking).not.to.be.ok;
			});

			it("should set location path to the root group ID", function () {
				expect(location.path()).to.equal("/local/test-name/1234");
			});
		});

		describe("with a successful server response with a non-default redirect ID", function () {
			beforeEach(function () {
				scope.redirectId = "5678";

				scope.$apply(function () {
					databaseMock.deferred.resolve({
						name: "Test Database",
						description: "This is a test database",
						groups: [{
							id: "1234",
							name: "Test Group"
						}, {
							id: "5678",
							name: "Test Group 2"
						}]
					});
				});
			});

			it("should set location path to the specified group ID", function () {
				expect(location.path()).to.equal("/local/test-name/5678");
			});
		});
	});
});