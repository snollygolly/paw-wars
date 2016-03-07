"use strict";

module.exports = function grunt(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// Delete compiled files before recompiling
		clean: {
			styles: ["assets/css/custom.css"]
		},

		// converts SASS to CSS
		sass: {
			styles: {
				options: {
					style: "expanded",
					cacheLocation: "assets/css/_src/.sass-cache"
				},
				files: {
					"assets/css/custom.css": ["assets/css/custom.scss"]
				}
			}
		},

		// Watch directories for changes
		watch: {
			styles: {
				files: ["assets/css/_src/**/*.scss"],
				tasks: ["sass"]
			},
			livereload: {
				files: [
					"assets/css/custom.css"
				],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				script: "index.js",
				options: {
					ext: "js,hbs"
				}
			}
		},

		concurrent: {
			dev: {
				tasks: ["nodemon", "watch"],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});
	// END grunt.initConfig();

	// Load Grunt dependencies
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-nodemon");

	grunt.registerTask("compile", ["clean", "sass"]);

	// Default grunt task
	grunt.registerTask("default", ["clean", "sass", "concurrent"]);
};
