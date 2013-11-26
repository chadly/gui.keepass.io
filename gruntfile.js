module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			dev: {
				src: ["src/client/css/app.less"],
				dest: "src/client/css/app.less.css"
			},
			prod: {
				options: {
					yuicompress: true
				},
				src: ["src/client/css/app.less"],
				dest: "src/client/css/app.less.css"
			}
		},
		jshint: {
			server: ["src/server/**/*.js"],
			client: ["src/client/**/*.js", "!src/client/vendor/**/*.js", "!src/client/**/*.min.js"]
		},
		copy: {
			bootstrap: {
				files: [{
					expand: true,
					cwd: "bower_components/bootstrap/less/",
					src: ["*.less"],
					dest: "src/client/vendor/bootstrap/less/"
				}, {
					expand: true,
					cwd: "bower_components/bootstrap/dist/fonts/",
					src: ["*.*"],
					dest: "src/client/vendor/bootstrap/fonts/"
				}]
			},
			"bootstrap-growl": {
				src: "bower_components/bootstrap-growl/jquery.bootstrap-growl.js",
				dest: "src/client/vendor/jquery.bootstrap-growl.js"
			}
		},
		watch: {
			less: {
				files: ["**/*.less"],
				tasks: ["less:dev"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("dev", ["copy", "less:dev", "jshint"]);
	grunt.registerTask("prod", ["copy", "less:prod", "jshint"]);
	grunt.registerTask("default", ["dev"]);
};