(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("Backbone"), require("Backgrid"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "Backbone", "Backgrid"], factory);
	else if(typeof exports === 'object')
		exports["Backgrid.Extension.ColumnManager"] = factory(require("_"), require("Backbone"), require("Backgrid"));
	else
		root["Backgrid.Extension.ColumnManager"] = factory(root["_"], root["Backbone"], root["Backgrid"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
	var Backbone = __webpack_require__(2);
	var Backgrid = __webpack_require__(3);

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
			console.error("Backgrid.ColumnManager: options.columns is not an instance of Backgrid.Columns");
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
	 * Toggles a columns' visibility
	 * @param {string|number|Backgrid.Column} col
	 */
	Backgrid.Extension.ColumnManager.prototype.toggleColumnVisibility = function(col) {
		// If column is a valid backgrid column, set the renderable property to true
		var column = this.getColumn(col);
		if (column) {
			if (column.get("renderable")) {
				this.hideColumn(column);
			}
			else {
				this.showColumn(column);
			}
		}
	};

	/**
	 * Returns the managed column collection
	 * @return {Backgrid.Columns}
	 */
	Backgrid.Extension.ColumnManager.prototype.getColumnCollection = function() {
		return this.columns;
	};

	/*
		Column manager visibility ui control
	 */

	var DropDownItemView = Backbone.View.extend({
		className: "columnmanager-dropdown-item",
		initialize: function(opts) {
			this.columnManager = opts.columnManager;
			this.column = opts.column;

			_.bindAll(this, "render", "toggleVisibility");
			this.column.on("change:renderable", this.render, this);
			this.el.addEventListener("click", this.toggleVisibility, true);
		},
		render: function() {
			this.$el.empty();
			var col = this.column;
			this.$el.append("<div><span>" + col.get("name") + "</span><span>" + ((col.get("renderable")) ? " Y" : " N") + "</span></div>");
			return this;
		},
		toggleVisibility: function(e) {
			if (e) {
				this.stopPropagation(e);
			}
			this.columnManager.toggleColumnVisibility(this.column);
		},
		stopPropagation: function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		}
	});

	var DropDownView = Backbone.View.extend({
		className: "columnmanager-dropdown-container",
		initialize: function(opts) {
			this.columnManager = opts.columnManager;

			this.on("dropdown:opened", this.open, this);
			this.on("dropdown:closed", this.close, this);
			this.columnManager.columns.on("add remove", this.render, this);
		},
		render: function() {
			var view = this;
			view.$el.empty();

			// List all columns
			this.columnManager.columns.each(function(col) {
				view.$el.append(new DropDownItemView({
					column: col,
					columnManager: view.columnManager
				}).render().el);
			});
		},
		open: function(){
			this.$el.addClass("open");
		},

		close: function(){
			this.$el.removeClass("open");
		}
	});

	/**
	 * UI control which manages visibility of columns.
	 *
	 * Inspired by: https://github.com/kjantzer/backbonejs-dropdown-view
	 *
	 * @param {Object} options
	 * @class Backgrid.Extension.ColumnManagerControl
	 */
	Backgrid.Extension.ColumnManagerVisibilityControl = Backbone.View.extend({
		tagName: "div",
		className: "columnmanager-visibilitycontrol",
		defaultEvents: {
			"click": "stopPropagation"
		},
		defaultOpts: {
			width: 200,
			closeOnEsc: true,
			openOnInit: false,
			columnManager: null,
			view: null
		},
		/**
		 * @param {Object} opts
		 * @param {Backgrid.Extension.ColumnManager} opts.columnManager ColumnManager instance
		 */
		initialize: function(opts) {
			this.options = _.extend({}, this.defaultOpts, opts);
			this.events = _.extend({}, this.defaultEvents, this.events || {});
			this.columnManager = opts.columnManager;

			// Option checking
			if (!this.columnManager instanceof Backgrid.Extension.ColumnManager) {
				console.error("Backgrid.ColumnManager: options.columns is not an instance of Backgrid.Columns");
			}

			// Bind scope to events
			_.bindAll(this, "deferClose", "stopDeferClose", "closeOnEsc", "toggle", "render");

			// UI events
			document.body.addEventListener("click", this.deferClose, true);
			this.el.addEventListener("click", this.stopDeferClose, true);
			if (this.options.closeOnEsc) {
				document.body.addEventListener("keyup", this.closeOnEsc, false);
			}
			this.el.addEventListener("click", this.toggle, false);

			// Create elements
			this.setup();

			// when the dropdown is opened, render the view
			//this.on("dropdown:opened", this.render, this);

			// listen for the view telling us to close
			this.view.on("dropdown:close", this.close, this);
			this.view.on("dropdown:open", this.open, this);
		},

		delayStart: function(){
			clearTimeout(this.closeTimeout);
			this.delayTimeout = setTimeout(this.open.bind(this), this.options.delay);
		},

		delayEnd: function(){
			clearTimeout(this.delayTimeout);
			this.closeTimeout = setTimeout(this.close.bind(this), 300);
		},

		setup: function(){
			this.$el.width(this.options.width + "px");
			this.view = (this.options.view instanceof Backbone.View) ? this.options.view : new DropDownView({
				columnManager: this.columnManager
			});
		},

		render: function(){
			this.$el.empty();

			// Render button
			this.$el.append("<button>DD</button>");

			// Render inner view
			this.view.render(); // tell the inner view to render itself
			this.$el.append(this.view.el);
			return this;
		},

		stopPropagation: function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		},

		// toggle open and close
		toggle: function(e){
			if(this.isOpen !== true) {
				this.open(e);
			}
			else {
				this.close(e);
			}
		},

		open: function(e){
			clearTimeout(this.closeTimeout);
			clearTimeout(this.deferCloseTimeout);

			if(e) {
				e.stopPropagation();
			}
			// don't do anything if we are already open
			if(this.isOpen) {
				return;
			}

			this.isOpen = true;
			this.$el.addClass("open");
			this.trigger("dropdown:opened");
			this.view.trigger("dropdown:opened"); // tell the inner view we've opened
			this.setDropdownPosition();
		},

		setDropdownPosition: function() {
			this.view.$el.css("top", this.$el.height());
		},

		close: function(e){
			// don"t do anything if we are already closed
			if (!this.isOpen) {
				return;
			}

			this.isOpen = false;
			this.$el.removeClass("open");
			this.trigger("dropdown:closed");
			this.view.trigger("dropdown:closed"); // tell the inner view we've closed
		},

		closeOnEsc: function(e){
			if (e.which === 27) {
				this.deferClose();
			}
		},

		deferClose: function(){
			this.deferCloseTimeout = setTimeout(this.close.bind(this), 0);
		},

		stopDeferClose: function(e){
			clearTimeout(this.deferCloseTimeout);
		}
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;