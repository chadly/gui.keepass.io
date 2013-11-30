//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Viewer Controller", function () {
	var expect = chai.expect, ctrl, scope;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();

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

		ctrl = $controller("DatabaseViewerCtrl", { $scope: scope });
	}));

	describe("when creating new instance of controller", function () {
		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
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
	});

	describe("when selecting a database group", function () {
		beforeEach(function () {
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