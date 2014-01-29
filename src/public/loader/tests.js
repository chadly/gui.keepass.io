//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Loader Controller", function () {
	var expect = chai.expect;

	describe("when creating new instance of controller", function () {
		var ctrl, scope;

		beforeEach(angular.mock.module("keepass.io"));

		beforeEach(angular.mock.inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller("LoaderCtrl", {
				$scope: scope,
				$routeParams: {
					type: "local"
				}
			});
		}));

		it("should create controller", function () {
			expect(ctrl).not.to.be.undefined;
		});

		it("should set loader type on scope", function () {
			expect(scope.type).to.equal("local");
		});

		describe("with successful server response of multiple databases", function () {
			beforeEach(angular.mock.inject(function ($httpBackend) {
				$httpBackend.when("GET", "/api/local").respond({
					databases: [{
						name: "test1.kdbx",
						size: 100,
						modifiedOn: "2013-11-27"
					}, {
						name: "test2.kdbx",
						size: 200,
						modifiedOn: "2012-11-27"
					}]
				});

				$httpBackend.flush();
			}));

			it("should set list of databases from server on scope", function () {
				expect(scope.databases).not.to.be.undefined;
				expect(scope.databases.length).to.equal(2);

				expect(scope.databases[0].name).to.equal("test1.kdbx");
				expect(scope.databases[1].name).to.equal("test2.kdbx");
			});
		});

		describe("with successful server response with single database", function () {
			var location;

			beforeEach(angular.mock.inject(function ($httpBackend, $location) {
				location = $location;

				$httpBackend.when("GET", "/api/local").respond({
					databases: [{
						name: "test1.kdbx",
						size: 100,
						modifiedOn: "2013-11-27"
					}]
				});

				$httpBackend.flush();
			}));

			it("should redirect to the single database", function () {
				expect(location.path()).to.equal("/local/test1.kdbx");
			});
		});
	});
});