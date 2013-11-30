//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Entry Controller", function () {
	var expect = chai.expect, ctrl, scope;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();

		scope.selectedEntry = function () {
			return {
				title: "Simpsons Test",
				username: "homer.simpson",
				password: "doh!",
				fields: {
					"City": "Springfield",
					"State": "??"
				}
			};
		};

		ctrl = $controller("DatabaseEntryCtrl", { $scope: scope });
	}));

	describe("when creating new instance of controller", function () {
		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
		});

		it("should copy entry data to scope", function () {
			expect(scope.title).to.equal("Simpsons Test");
			expect(scope.username).to.equal("homer.simpson");
			expect(scope.password).to.equal("doh!");
		});

		it("should expand entry fields to array on scope", function () {
			expect(scope.fields).not.to.be.undefined;
			expect(scope.fields.length).to.equal(2);

			expect(scope.fields[0].key).to.equal("City");
			expect(scope.fields[0].value).to.equal("Springfield");

			expect(scope.fields[1].key).to.equal("State");
			expect(scope.fields[1].value).to.equal("??");
		});
	});
});