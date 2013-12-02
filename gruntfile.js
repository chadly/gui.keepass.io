var path = require("path");

module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			dev: {
				src: ["src/client/app.less"],
				dest: "src/client/app.less.css"
			},
			prod: {
				options: {
					yuicompress: true
				},
				src: ["src/client/app.less"],
				dest: "src/client/app.less.css"
			}
		},
		jshint: {
			server: ["src/server/**/*.js"],
			client: ["src/client/**/*.js", "!src/client/vendor/**/*.js", "!src/client/**/*.min.js"]
		},
		copy: {
			config: {
				//create the config.js file in the root if it is not already there
				src: ["config.example.js"],
				dest: "config.js",
				filter: function (filepath) {
					var dest = path.join(
						grunt.config("copy.config.dest"),
						// Remove the parent directory from filepath
						filepath.split(path.sep).slice(2).join(path.sep)
					);
					return !(grunt.file.exists(dest));
				}
			},
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
			},
			"bootswatch": {
				expand: true,
				cwd: "bower_components/bootswatch/slate/",
				src: ["*.less"],
				dest: "src/client/vendor/bootswatch/slate/"
			}
		},
		mocha: {
			client: {
				src: ["src/client/test.html"]
			},
			options: {
				run: true
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
	grunt.loadNpmTasks("grunt-mocha");

	grunt.registerTask("dev", ["copy", "less:dev", "jshint"]);
	grunt.registerTask("prod", ["copy", "less:prod", "jshint"]);
	grunt.registerTask("default", ["dev"]);
};