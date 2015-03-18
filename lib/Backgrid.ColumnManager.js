(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("Backgrid"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "Backgrid"], factory);
	else if(typeof exports === 'object')
		exports["Backgrid.Extension.ColumnManager"] = factory(require("_"), require("Backgrid"));
	else
		root["Backgrid.Extension.ColumnManager"] = factory(root["_"], root["Backgrid"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Dependencies
	var _ = __webpack_require__(1);
	var Backgrid = __webpack_require__(2);

	/**
	 * Manages visibility of columns.
	 *
	 * @param {Backgrid.Columns} columns
	 * @param {Object} options
	 * @param {number} options.initialColumnCount initial amount of columns to show.
	 *
	 * @class Backgrid.Extension.ColumnManager
	 */
	Backgrid.Extension.ColumnManager = function(columns, options){
		/**
		 * Default configuration for ColumnManager.
		 *
		 * @cfg {number} [defaults.initialColumnCount] Number of columns initially visible.
		 */
		var defaults = {
			initialColumnsVisible: null
		};

		// Save options and merge with defaults
		this.options = _.extend({}, defaults, options);

		// Check if columns is instance of Backgrid.Columns
		if (columns instanceof Backgrid.Columns) {
			// Save columns
			this.columns = columns;

			// Set initial column settings
			this.setInitialColumnVisibility();
		}
		else {
			// Issue warning
			console.warn("Backgrid.ColumnManager: columns is not an instance of Backgrid.Columns");
		}
	};

	/**
	 * Loops over all columns and sets the visibility according to provided options.
	 *
	 */
	Backgrid.Extension.ColumnManager.prototype.setInitialColumnVisibility = function() {
		// Loop columns and set renderable property according to settings
		var initialColumnsVisible = this.options.initialColumnsVisible;

		if (this.columns instanceof Backgrid.Columns && initialColumnsVisible) {
			this.columns.each(function(col, index) {
				col.set("renderable", index < initialColumnsVisible);
			});
		}
	};

	/**
	 * Convenience function to retrieve a column either directly or by its id.
	 * Returns false if no column is found.
	 *
	 * @param {string|number|Backgrid.Column} col
	 * @returns {Backgrid.Column|boolean}
	 */
	Backgrid.Extension.ColumnManager.prototype.getColumn = function(col) {
		// If column is a string or number, try to find a column which has that ID
		if (_.isNumber(col) || _.isString(col)) {
			col = this.columns.get(col);
		}
		return (col instanceof Backgrid.Column) ? col : false;
	};

	/**
	 * Hides a column
	 * @param {string|number|Backgrid.Column} col
	 */
	Backgrid.Extension.ColumnManager.prototype.hideColumn = function(col) {
		// If column is a valid backgrid column, set the renderable property to false
		var column = this.getColumn(col);
		if (column) {
			column.set("renderable", false);
		}
	};

	/**
	 * Shows a column
	 * @param {string|number|Backgrid.Column} col
	 */
	Backgrid.Extension.ColumnManager.prototype.showColumn = function(col) {
		// If column is a valid backgrid column, set the renderable property to true
		var column = this.getColumn(col);
		if (column) {
			column.set("renderable", true);
		}
	};

	/**
	 * UI control which manages visibility of columns.
	 *
	 * @param {Object} options
	 * @class Backgrid.Extension.ColumnManagerControl
	 */
	Backgrid.Extension.ColumnManagerControl = function(options) {
		// Save options
		this.options = options;
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;