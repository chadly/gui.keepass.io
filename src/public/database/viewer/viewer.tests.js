//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Viewer Controller", function () {
	var expect = chai.expect, ctrl, scope, databaseMock, routeParams;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller, $q) {
		scope = $rootScope.$new();

		routeParams = {
			type: "local",
			name: "test-name",
			id: "g1"
		};

		databaseMock = {
			unlock: function () {
				this.deferred = $q.defer();
				return this.deferred.promise;
			}
		};

		ctrl = $controller("DatabaseViewerCtrl", {
			$scope: scope,
			database: databaseMock,
			$routeParams: routeParams
		});
	}));

	describe("when creating new instance of controller", function () {
		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
		});

		it("should not blow up on isSelected and return false", function () {
			expect(scope.isSelected({})).to.be.false;
			expect(scope.isSelected()).to.be.false;
		});

		it("should set scope redirect ID", function () {
			expect(scope.redirectId).to.equal("g1");
		});
	});

	describe("when database is loaded", function () {
		beforeEach(function () {
			databaseMock.deferred.resolve({
				name: "Test Database",
				description: "This is a test database",
				groups: [{
					id: "g1",
					name: "Group 1",
					entries: [{ id: "e1", title: "Entry 1", url: "google.com" }, { id: "e2", title: "Entry 2", url: "https://www.bing.com" }],
					groups: [{
						id: "g2",
						name: "Subgroup 1",
						entries: [{ id: "e3", title: "Subentry 1" }, { id: "e4", title: "Subentry 2" }]
					}, {
						id: "g3",
						name: "Subgroup 2",
						entries: []
					}]
				}, {
					id: "g4",
					name: "Group 2",
					entries: []
				}]
			});
		});

		describe("successfully", function () {
			beforeEach(function () {
				scope.$apply();
			});

			it("should populate title from database data", function () {
				expect(scope.title).to.equal("Test Database");
			});

			it("should populate description from database data", function () {
				expect(scope.description).to.equal("This is a test database");
			});

			it("should populate groups from database data", function () {
				expect(scope.groups).not.to.be.undefined;
				expect(scope.groups.length).to.equal(2);
			});

			it("should populate parents for groups", function () {
				var parentGroup = scope.groups[0];
				expect(parentGroup.parent).to.be.undefined;

				expect(parentGroup.groups[0].parent).to.equal(parentGroup);
				expect(parentGroup.groups[1].parent).to.equal(parentGroup);
			});

			it("should populate parents for entries", function () {
				var parentGroup = scope.groups[0];
				expect(parentGroup.entries[0].parent).to.equal(parentGroup);
				expect(parentGroup.entries[1].parent).to.equal(parentGroup);
			});

			it("should populate flag on entries", function () {
				var parentGroup = scope.groups[0];
				expect(parentGroup.entries[0].isEntry).to.be.true;
				expect(parentGroup.entries[1].isEntry).to.be.true;
			});

			it("should fix invalid URLs on entries", function () {
				var entry = scope.groups[0].entries[0];
				expect(entry.url).to.equal("http://google.com");
			});

			it("should not molest existing valid URLs on entries", function () {
				var entry = scope.groups[0].entries[1];
				expect(entry.url).to.equal("https://www.bing.com");
			});
		});

		describe("with a selected group ID", function () {
			beforeEach(function () {
				scope.$apply(function () {
					routeParams.id = "g1";
				});
			});

			it("should mark group as selected", function () {
				expect(scope.selectedItem).to.equal(scope.groups[0]);
				expect(scope.isSelected(scope.groups[0])).to.be.true;
			});

			it("should not mark other groups as selected", function () {
				expect(scope.isSelected(scope.groups[0].groups[0])).to.be.false;
				expect(scope.isSelected(scope.groups[0].groups[1])).to.be.false;
				expect(scope.isSelected(scope.groups[1])).to.be.false;
			});

			it("should populate breadcrumbs", function () {
				expect(scope.breadcrumbs).not.to.be.undefined;
				expect(scope.breadcrumbs.length).to.equal(1);
				expect(scope.breadcrumbs[0]).to.equal(scope.groups[0]);
			});
		});

		describe("with a selected subgroup ID", function () {
			beforeEach(function () {
				scope.$apply(function () {
					routeParams.id = "g3";
				});
			});

			it("should mark group as selected", function () {
				expect(scope.selectedItem).to.equal(scope.groups[0].groups[1]);
				expect(scope.isSelected(scope.groups[0].groups[1])).to.be.true;
			});

			it("should mark parent group as selected", function () {
				expect(scope.isSelected(scope.groups[0])).to.be.true;
			});

			it("should populate breadcrumbs", function () {
				expect(scope.breadcrumbs).not.to.be.undefined;
				expect(scope.breadcrumbs.length).to.equal(2);

				expect(scope.breadcrumbs[0]).to.equal(scope.groups[0]);
				expect(scope.breadcrumbs[1]).to.equal(scope.groups[0].groups[1]);
			});
		});

		describe("with a selected entry ID", function () {
			beforeEach(function () {
				scope.$apply(function () {
					routeParams.id = "e3";
				});
			});

			it("should mark entry as selected", function () {
				expect(scope.selectedItem).to.equal(scope.groups[0].groups[0].entries[0]);
				expect(scope.isSelected(scope.groups[0].groups[0].entries[0])).to.be.true;
			});

			it("should mark parent group as selected", function () {
				expect(scope.isSelected(scope.groups[0].groups[0])).to.be.true;
			});

			it("should mark grandparent group as selected", function () {
				expect(scope.isSelected(scope.groups[0])).to.be.true;
			});

			it("should populate breadcrumbs", function () {
				expect(scope.breadcrumbs).not.to.be.undefined;
				expect(scope.breadcrumbs.length).to.equal(3);

				expect(scope.breadcrumbs[0]).to.equal(scope.groups[0]);
				expect(scope.breadcrumbs[1]).to.equal(scope.groups[0].groups[0]);
				expect(scope.breadcrumbs[2]).to.equal(scope.groups[0].groups[0].entries[0]);
			});
		});
	});

	describe("when database fails to load", function () {
		var location;

		beforeEach(angular.mock.inject(function ($location) {
			location = $location;

			scope.$apply(function () {
				databaseMock.deferred.reject();
			});
		}));

		it("should redirect to unlock controller", function () {
			expect(location.path()).to.equal("/local/test-name");
		});
	});
});