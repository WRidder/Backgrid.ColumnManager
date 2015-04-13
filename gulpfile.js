"use strict";

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require("gulp");
require("gulp-grunt")(gulp); // add all the gruntfile tasks to gulp
var watch = require("gulp-watch");
var runSequence = require("run-sequence");
var clean = require("gulp-clean");
var $ = require("gulp-load-plugins")();
var webpack = require("webpack");

// Settings
var DEST = "dist";                         // The build output folder

// The default task
gulp.task("default", ["build", "watch"]);

// ESLint
var eslint = require("gulp-eslint");

gulp.task("lint", function() {
	return gulp.src("src/*.js")
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

var RELEASE = false;
gulp.task("bundle-release", function(cb) {
	RELEASE = true;
	gulp.start("bundle");
	RELEASE = false;
	cb();
});

// Bundle
gulp.task("bundle", function (cb) {
	var started = false;
	var config = require("./config/webpack.js")(RELEASE);
	var bundler = webpack(config);

	function bundle(err, stats) {
		if (err) {
			throw new $.util.PluginError("webpack", err);
		}
		if (!started) {
			started = true;
			return cb();
		}
	}

	bundler.run(bundle);
});

// Clean task
gulp.task("build-clean", function() {
	return gulp.src(DEST).pipe(clean());
});

// Build the app from source code
gulp.task("build", function(cb) {
	runSequence("build-clean", "lint", "bundle", "grunt-test", "bundle-release", "docs", cb);
});

// Watcher
gulp.task("watch", function () {
	watch(["src/**", "test/**"], function() {
		gulp.start("build");
	});
});

// Documentation
var yuidoc = require("gulp-yuidoc");
gulp.task("docs", function() {
	return gulp.src("./src/*.js")
		.pipe(yuidoc())
		.pipe(gulp.dest("./docs"));
});
