angular.module("keepass.io").service("notify", function () {
	this.warning = function (msg) {
		notify(msg);
	};

	this.info = function (msg) {
		notify(msg, "info");
	};

	this.danger = function (msg) {
		notify(msg, "danger");
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