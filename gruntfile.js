"use strict";
module.exports = function (grunt) {
	grunt.initConfig({
		jasmine: {
			test: {
				src: 'Backbone.ColumnManager.js',
				options: {
					specs: 'test/test.js',
					vendor: [
						"node_modules/underscore/underscore-min.js",
						"node_modules/backbone/backbone-min.js"
					]
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.registerTask("test", "jasmine");
};