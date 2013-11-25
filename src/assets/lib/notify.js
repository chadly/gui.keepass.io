angular.module("keepass.io").service("notify", function () {
	this.warning = function (msg) {
		notify(msg);
	};

	this.info = function (msg) {
		notify(msg, "info");
	};

	this.error = function (msg) {
		notify(msg, "error");
	};

	this.success = function (msg) {
		notify(msg, "success");
	};

	function notify(msg, type) {
		$.bootstrapGrowl(msg, {
			type: type,
			width: "auto",
			align: "center",
			delay: 25000
		});
	}
});