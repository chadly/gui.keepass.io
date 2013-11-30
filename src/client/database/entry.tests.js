//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Entry Controller", function () {
	var expect = chai.expect, ctrl, scope;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();

		scope.selectedEntry = function () {
			return {
				title: "Test Entry",
				username: "homer.simpson",
				password: "doh!"
			};
		};

		ctrl = $controller("DatabaseEntryCtrl", { $scope: scope });
	}));

	describe("when creating new instance of controller", function () {
		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
		});

		it("should copy entry data to scope", function () {
			expect(scope.title).to.equal("Test Entry");
			expect(scope.username).to.equal("homer.simpson");
			expect(scope.password).to.equal("doh!");
		});
	});
});