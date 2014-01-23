//https://github.com/chaijs/chai/issues/41
/* jshint expr:true */

describe("Database Service", function () {
	var expect = chai.expect, service, scope;

	beforeEach(angular.mock.module("keepass.io"));

	beforeEach(angular.mock.inject(function ($rootScope, database) {
		scope = $rootScope;
		service = database;
	}));

	describe("when creating new instance of service", function () {
		it("should create service", function () {
			expect(service).not.to.be.undefined;
		});
	});

	describe("when unlocking a new database", function () {
		var http, promise;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;
			promise = service.unlock("local", "test-name", "my voice is my passport");
		}));

		it("should return a valid promise object", function () {
			expect(promise).not.to.be.undefined;
		});

		describe("with an invalid-password server response", function () {
			var isPromiseFailed;

			beforeEach(function () {
				promise.catch(function () {
					isPromiseFailed = true;
				});

				http.expectPOST("/api/local/test-name", {
					password: "my voice is my passport"
				}).respond(401);

				http.flush();
			});

			it("should have posted master password to server", function () {
				http.verifyNoOutstandingExpectation();
			});

			it("should reject the promise", function () {
				expect(isPromiseFailed).to.be.true;
			});

			it("should not return same promise for database name", function () {
				var newPromise = service.unlock("local", "test-name");
				expect(newPromise).not.to.equal(promise);
			});
		});

		describe("with a successful server response", function () {
			var isPromiseSuccess, loadedData;

			beforeEach(function () {
				promise.then(function (data) {
					isPromiseSuccess = true;
					loadedData = data;
				});

				setupSuccessfulServerReponse(http);
				http.flush();
			});

			it("should have posted master password to server", function () {
				http.verifyNoOutstandingExpectation();
			});

			it("should resolve the promise", function () {
				expect(isPromiseSuccess).to.be.true;
			});

			it("should return database data from server", function () {
				expect(loadedData).not.to.be.undefined;
				expect(loadedData.name).to.equal("Test Database");
			});

			it("should return same promise for database name", function () {
				var newPromise = service.unlock("local", "test-name");
				expect(newPromise).to.equal(promise);
			});
		});
	});

	describe("when unlocking an existing database", function () {
		var http, promise, loadedData;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;

			setupSuccessfulServerReponse(http);
			service.unlock("local", "test-name", "my voice is my passport");
			http.flush();

			//unlock again, expect no server request
			service.unlock("local", "test-name").then(function (data) {
				loadedData = data;
			});
		}));

		it("should not make another server request", function () {
			http.verifyNoOutstandingExpectation();
		});

		it("should return database data from previous server response", function () {
			expect(loadedData).not.to.be.undefined;
			expect(loadedData.name).to.equal("Test Database");
		});
	});
	
	describe("when unlocking a database with similar name but different type than an existing database", function () {
		var http;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;

			setupSuccessfulServerReponse(http);
			service.unlock("local", "test-name", "my voice is my passport");
			http.flush();

			service.unlock("gdrive", "test-name", "my voice is my passport");
			setupSuccessfulServerReponse(http, "gdrive");
		}));

		it("should make another server request", function () {
			http.verifyNoOutstandingExpectation();
		});
	});

	describe("when unlocking a locked database without a password", function () {
		var http, errorStatus;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;

			scope.$apply(function () {
				service.unlock("local", "test-name").catch(function (status) {
					errorStatus = status;
				});
			});
		}));

		it("should not make any server request", function () {
			http.verifyNoOutstandingExpectation();
		});

		it("should return error status of 'missing password'", function () {
			expect(errorStatus).to.equal("PasswordRequired");
		});
	});

	describe("when locking an unlocked database", function () {
		var http, promise, loadedData;

		beforeEach(angular.mock.inject(function ($httpBackend) {
			http = $httpBackend;

			setupSuccessfulServerReponse(http);
			service.unlock("local", "test-name", "my voice is my passport");
			http.flush();

			service.lock("local", "test-name");
		}));

		it("should make another ajax request when unlocking database again", function () {
			setupSuccessfulServerReponse(http);
			service.unlock("local", "test-name", "my voice is my passport");
			http.flush();
			http.verifyNoOutstandingExpectation();
		});
	});

	function setupSuccessfulServerReponse(http, type) {
		http.expectPOST("/api/" + (type || "local") + "/test-name", {
			password: "my voice is my passport"
		}).respond(200, JSON.stringify({
			name: "Test Database",
			description: "This is a test database",
			groups: [{
				id: "1234",
				name: "Test Group"
			}]
		}));
	}
});