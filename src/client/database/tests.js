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

	describe("when selecting a database group", function () {
		beforeEach(function () {
			scope.database = {
				name: "Test Database",
				description: "This is a test database",
				groups: [{
					name: "Group 1",
					entries: [],
					groups: [{
						name: "Subgroup 1",
						entries: []
					}, {
						name: "Subgroup 2",
						entries: []
					}]
				}, {
					name: "Group 2",
					entries: []
				}]
			};

			scope.select(scope.database.groups[0]);
		});

		it("should mark group as selected", function () {
			expect(scope.database.groups[0].isSelected).to.be.true;
		});

		it("should not mark entry as selected", function () {
			expect(scope.selectedEntry()).to.be.undefined;
		});

		describe("with other groups already selected", function () {
			beforeEach(function () {
				scope.database.groups[0].groups[0].isSelected = true;
				scope.database.groups[0].groups[1].isSelected = true;
				scope.database.groups[1].isSelected = true;

				scope.select(scope.database.groups[0]);
			});

			it("should mark group as selected", function () {
				expect(scope.database.groups[0].isSelected).to.be.true;
			});

			it("should not mark entry as selected", function () {
				expect(scope.selectedEntry()).to.be.undefined;
			});

			it("should deselect existing selected groups", function () {
				expect(scope.database.groups[0].groups[0].isSelected).to.be.false;
				expect(scope.database.groups[0].groups[1].isSelected).to.be.false;
				expect(scope.database.groups[1].isSelected).to.be.false;
			});
		});
	});

	describe("when selecting a database entry", function () {
		beforeEach(function () {
			scope.database = {
				name: "Test Database",
				description: "This is a test database",
				groups: [{
					name: "Group 1",
					entries: [{ title: "Entry 1" }, { title: "Entry 2" }],
					groups: [{
						name: "Subgroup 1",
						entries: [{ title: "Subentry 1" }, { title: "Subentry 2" }]
					}, {
						name: "Subgroup 2",
						entries: []
					}]
				}, {
					name: "Group 2",
					entries: []
				}]
			};

			scope.select(scope.database.groups[0].entries[0]);
		});

		it("should mark group as selected", function () {
			expect(scope.database.groups[0].isSelected).to.be.true;
		});

		it("should mark entry as selected", function () {
			expect(scope.database.groups[0].entries[0].isSelected).to.be.true;
		});

		it("should return selected entry", function () {
			expect(scope.selectedEntry()).to.equal(scope.database.groups[0].entries[0]);
		});
	});
});