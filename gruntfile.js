var path = require("path");

module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			options: {
				relativeUrls: true
			},
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
			vendor: {
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
				}, {
					expand: true,
					cwd: "bower_components/font-awesome/less/",
					src: ["*.less"],
					dest: "src/client/vendor/font-awesome/less/"
				}, {
					expand: true,
					cwd: "bower_components/font-awesome/fonts/",
					src: ["*.*"],
					dest: "src/client/vendor/font-awesome/fonts/"
				}, {
					expand: true,
					cwd: "bower_components/bootstrap-growl/",
					src: ["jquery.bootstrap-growl.js"],
					dest: "src/client/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/bootswatch/slate/",
					src: ["*.less"],
					dest: "src/client/vendor/bootswatch/"
				}, {
					expand: true,
					cwd: "bower_components/jquery/",
					src: ["jquery.js"],
					dest: "src/client/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular/",
					src: ["angular.js"],
					dest: "src/client/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular-route/",
					src: ["angular-route.js"],
					dest: "src/client/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular-mocks/",
					src: ["angular-mocks.js"],
					dest: "src/client/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/zeroclipboard/",
					src: ["zeroclipboard.js", "zeroclipboard.swf"],
					dest: "src/client/vendor/"
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: "src/",
					src: ["**/*.*", "!client/**/*", "client/ngapp.min.js"],
					dest: "build/"
				}, {
					expand: true,
					src: ["node_modules/**/*"],
					dest: "build/"
				}]
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
		},
		shell: {
			options: {
				stdout: true
			},
			prune: {
				command: "npm prune --production"
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
	grunt.loadNpmTasks("grunt-shell");

	grunt.registerTask("dev", ["copy:vendor", "less:dev", "jshint"]);
	grunt.registerTask("dist", ["copy:vendor", "less:prod", "jshint", "ngmin", "ngtemplates", "uglify", "shell:prune", "copy:dist"]);
	grunt.registerTask("test", ["copy:vendor", "mocha"]);
	grunt.registerTask("default", ["dev"]);
};