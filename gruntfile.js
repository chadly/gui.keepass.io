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
			client: [
				"src/client/**/*.js",
				"!src/client/vendor/**/*.js",
				"!src/client/*.min.js",
				"!src/client/ng*.js"
			]
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
				}, {
					expand: true,
					cwd: "bower_components/bootstrap/dist/js/",
					src: ["bootstrap.js"],
					dest: "src/client/vendor/bootstrap/js/"
				}]
			},
			"font-awesome": {
				files: [{
					expand: true,
					cwd: "bower_components/font-awesome/css/",
					src: ["*.css"],
					dest: "src/client/vendor/font-awesome/css/"
				}, {
					expand: true,
					cwd: "bower_components/font-awesome/fonts/",
					src: ["*.*"],
					dest: "src/client/vendor/font-awesome/fonts/"
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
			},
			"jquery": {
				src: "bower_components/jquery/jquery.js",
				dest: "src/client/vendor/jquery.js"
			},
			"angular": {
				src: "bower_components/angular/angular.js",
				dest: "src/client/vendor/angular.js"
			},
			"angular-route": {
				src: "bower_components/angular-route/angular-route.js",
				dest: "src/client/vendor/angular-route.js"
			},
			"angular-mocks": {
				src: "bower_components/angular-mocks/angular-mocks.js",
				dest: "src/client/vendor/angular-mocks.js"
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
		},
		ngmin: {
			app: {
				src: [
					"src/client/app.js",
					"src/client/**/*.js",
					"!src/client/vendor/**/*.*",
					"!**/*tests.js",
					"!**/*.min.js",
					"!**/ng*.js"
				],
				dest: "src/client/ngapp.js"
			}
		},
		ngtemplates: {
			options: {
				url: function (url) {
					return url.replace("src/client/", "/assets/");
				}
			},
			'keepass.io': {
				src: ["src/client/**/*.html"],
				dest: "src/client/ngtemplates.js"
			}
		},
		uglify: {
			app: {
				src: [
					"src/client/vendor/jquery.js",
					"src/client/vendor/angular.js",
					"src/client/vendor/**/*.js",
					"!src/client/vendor/angular-mocks.js",
					"src/client/ng*.js",
					"!src/client/*.min.js"
				],
				dest: "src/client/ngapp.min.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-mocha");
	grunt.loadNpmTasks("grunt-ngmin");
	grunt.loadNpmTasks("grunt-angular-templates");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("dev", ["copy", "less:dev", "jshint"]);
	grunt.registerTask("dist", ["copy", "less:prod", "jshint", "ngmin", "ngtemplates", "uglify"]);
	grunt.registerTask("default", ["dev"]);
};