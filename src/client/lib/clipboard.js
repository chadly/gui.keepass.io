angular.module("keepass.io").directive("clipboard", function () {
	ZeroClipboard.setDefaults({
		moviePath: "/assets/vendor/zeroclipboard.swf",
		forceHandCursor: true
	});

	return {
		scope: {
			clipboard: "="
		},
		restrict: "A",
		link: function (scope, element, attrs) {
			//store the scope because apparently new ZeroClipboard() is really just a singleton
			//https://github.com/zeroclipboard/zeroclipboard/issues/90
			element[0].scope = scope;

			var clip = new ZeroClipboard(element);
			clip.on("dataRequested", function (client) {
				client.setText(this.scope.clipboard);
			});
		}
	};
});