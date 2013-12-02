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
				entries: [{ title: "Entry 1", url: "google.com" }, { title: "Entry 2", url: "https://www.bing.com" }],
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

	describe("when selecting a database group", function () {
		beforeEach(function () {
			scope.select(scope.groups[0]);
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
	});

	describe("when selecting a database subgroup", function () {
		beforeEach(function () {
			scope.select(scope.groups[0].groups[1]);
		});

		it("should mark group as selected", function () {
			expect(scope.selectedItem).to.equal(scope.groups[0].groups[1]);
			expect(scope.isSelected(scope.groups[0].groups[1])).to.be.true;
		});

		it("should mark parent group as selected", function () {
			expect(scope.isSelected(scope.groups[0])).to.be.true;
		});
	});

	describe("when selecting a database entry", function () {
		beforeEach(function () {
			scope.select(scope.groups[0].groups[0].entries[0]);
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
	});

	describe("when determining if an item is selected with no selected items", function () {
		beforeEach(function () {
			scope.selectedItem = null;
		});

		it("should not blow up when and return false", function () {
			expect(scope.isSelected(scope.groups[0])).to.be.false;
		});
	});
});