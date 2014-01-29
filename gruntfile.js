var path = require("path");

module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			options: {
				relativeUrls: true
			},
			dev: {
				src: ["src/public/app.less"],
				dest: "src/public/app.less.css"
			},
			prod: {
				options: {
					yuicompress: true
				},
				src: ["src/public/app.less"],
				dest: "src/public/app.less.css"
			}
		},
		jshint: {
			app: [
				"src/**/*.js",
				"!src/public/vendor/**/*.js",
				"!src/public/*.min.js",
				"!src/public/ng*.js"
			]
		},
		copy: {
			vendor: {
				files: [{
					expand: true,
					cwd: "bower_components/bootstrap/less/",
					src: ["*.less"],
					dest: "src/public/vendor/bootstrap/less/"
				}, {
					expand: true,
					cwd: "bower_components/bootstrap/dist/fonts/",
					src: ["*.*"],
					dest: "src/public/vendor/bootstrap/fonts/"
				}, {
					expand: true,
					cwd: "bower_components/bootstrap/dist/js/",
					src: ["bootstrap.js"],
					dest: "src/public/vendor/bootstrap/js/"
				}, {
					expand: true,
					cwd: "bower_components/font-awesome/less/",
					src: ["*.less"],
					dest: "src/public/vendor/font-awesome/less/"
				}, {
					expand: true,
					cwd: "bower_components/font-awesome/fonts/",
					src: ["*.*"],
					dest: "src/public/vendor/font-awesome/fonts/"
				}, {
					expand: true,
					cwd: "bower_components/bootstrap-growl/",
					src: ["jquery.bootstrap-growl.js"],
					dest: "src/public/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/bootswatch/united/",
					src: ["*.less"],
					dest: "src/public/vendor/bootswatch/"
				}, {
					expand: true,
					cwd: "bower_components/jquery/",
					src: ["jquery.js"],
					dest: "src/public/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular/",
					src: ["angular.js"],
					dest: "src/public/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular-route/",
					src: ["angular-route.js"],
					dest: "src/public/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/angular-mocks/",
					src: ["angular-mocks.js"],
					dest: "src/public/vendor/"
				}, {
					expand: true,
					cwd: "bower_components/zeroclipboard/",
					src: ["ZeroClipboard.js", "ZeroClipboard.swf"],
					dest: "src/public/vendor/"
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: "src/",
					src: [
						"**/*.*",
						"!public/**/*",
						"public/ngapp.min.js",
						"public/*.less.css",
						"public/**/*.eot",
						"public/**/*.svg",
						"public/**/*.ttf",
						"public/**/*.woff",
						"public/**/*.otf",
						"public/**/*.swf"
					],
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
				src: ["src/public/test.html"]
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
					"src/public/app.js",
					"src/public/**/*.js",
					"!src/public/vendor/**/*.*",
					"!**/*tests.js",
					"!**/*.min.js",
					"!**/ng*.js"
				],
				dest: "src/public/ngapp.js"
			}
		},
		ngtemplates: {
			options: {
				url: function (url) {
					return url.replace("src/public/", "/assets/");
				}
			},
			'keepass.io': {
				src: ["src/public/**/*.html"],
				dest: "src/public/ngtemplates.js"
			}
		},
		uglify: {
			app: {
				src: [
					"src/public/vendor/jquery.js",
					"src/public/vendor/angular.js",
					"src/public/vendor/**/*.js",
					"!src/public/vendor/angular-mocks.js",
					"src/public/ng*.js",
					"!src/public/*.min.js"
				],
				dest: "src/public/ngapp.min.js"
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
	grunt.registerTask("package", ["copy:vendor", "less:prod", "jshint", "ngmin", "ngtemplates", "uglify"]);
	grunt.registerTask("build", ["package", "shell:prune", "copy:build"]);
	grunt.registerTask("test", ["copy:vendor", "mocha"]);
	grunt.registerTask("default", ["dev"]);
};