"use strict";

/**
 * A column manager for backgrid
 *
 * @module Backgrid.ColumnManager
 */

// Dependencies
var _ = require("underscore");
var Backbone = require("backbone");
var Backgrid = require("backgrid");

/**
 * Manages visibility of columns.
 *
 * @class Backgrid.Extension.ColumnManager ColumnManager
 * @constructor
 * @param {Backgrid.Columns} columns
 * @param {Object} [options]
 * @param {number} [options.initialColumnCount] Initial amount of columns to show. Default is null (All visible).
 */
Backgrid.Extension.ColumnManager = function(columns, options){
	// Save options and merge with defaults
	var defaults = {
		initialColumnsVisible: null
	};
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
 * @method setInitialColumnVisibility
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
 * @method getColumn
 * @param {string|number|Backgrid.Column} col
 * @return {Backgrid.Column|boolean}
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
 *
 * @method hidecolumn
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
 *
 * @method showColumn
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
 *
 * @method toggleColumnVisibility
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
 *
 * @method getColumnCollection
 * @return {Backgrid.Columns}
 */
Backgrid.Extension.ColumnManager.prototype.getColumnCollection = function() {
	return this.columns;
};

//////////////////////////////////////////////
/////////////// UI Controls //////////////////
//////////////////////////////////////////////

/**
 * A dropdown item view
 *
 * @class DropDownItemView
 * @extends Backbone.View
 */
var DropDownItemView = Backbone.View.extend({
	className: "columnmanager-dropdown-item",
	tagName: "li",

	/**
	 * @method initialize
	 * @param {object} opts
	 * @param {Backgrid.Extension.ColumnManager} opts.columnManager ColumnManager instance.
	 * @param {Backgrid.Column} opts.column A backgrid column.
	 */
	initialize: function(opts) {
		this.columnManager = opts.columnManager;
		this.column = opts.column;
		this.template = opts.template;

		_.bindAll(this, "render", "toggleVisibility");
		this.column.on("change:renderable", this.render, this);
		this.el.addEventListener("click", this.toggleVisibility, true);
	},

	/**
	 * @method render
	 * @return {DropDownItemView}
	 */
	render: function() {
		this.$el.empty();

		this.$el.append(this.template({
			label: this.column.get("label")
		}));

		if (this.column.get("renderable")) {
			this.$el.addClass((this.column.get("renderable")) ? "visible" : null);
		}
		else {
			this.$el.removeClass("visible");
		}

		return this;
	},

	/**
	 * Toggles visibility of column.
	 *
	 * @method toggleVisibility
	 * @param {object} e
	 */
	toggleVisibility: function(e) {
		if (e) {
			this.stopPropagation(e);
		}
		this.columnManager.toggleColumnVisibility(this.column);
	},

	/**
	 * Convenience function to stop event propagation.
	 *
	 * @method stopPropagation
	 * @param {object} e
	 * @private
	 */
	stopPropagation: function(e){
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
	}
});


/**
 * Dropdown view container.
 *
 * @class DropDownView
 * @extends Backbone.view
 */
var DropDownView = Backbone.View.extend({
	/**
	 * @property className
	 * @type String
	 * @default "columnmanager-dropdown-container"
	 */
	className: "columnmanager-dropdown-container",

	/**
	 * @method initialize
	 * @param {object} opts
	 * @param {Backgrid.Extension.ColumnManager} opts.columnManager ColumnManager instance.
	 * @param {Backbone.View} opts.DropdownItemView View to be used for the items.
	 * @param {Function} opts.dropdownItemTemplate
	 */
	initialize: function(opts) {
		this.options = opts;
		this.columnManager = opts.columnManager;
		this.ItemView = (opts.DropdownItemView instanceof Backbone.View) ? opts.DropdownItemView : DropDownItemView;

		this.on("dropdown:opened", this.open, this);
		this.on("dropdown:closed", this.close, this);
		this.columnManager.columns.on("add remove", this.render, this);
	},

	/**
	 * @method render
	 * @return {DropDownView}
	 */
	render: function() {
		var view = this;
		view.$el.empty();

		// List all columns
		this.columnManager.columns.each(function(col) {
			view.$el.append(new view.ItemView({
				column: col,
				columnManager: view.columnManager,
				template: view.options.dropdownItemTemplate
			}).render().el);
		});

		return this;
	},

	/**
	 * Opens the dropdown.
	 *
	 * @method open
	 */
	open: function(){
		this.$el.addClass("open");
	},

	/**
	 * Closes the dropdown.
	 *
	 * @method close
	 */
	close: function(){
		this.$el.removeClass("open");
	}
});

/**
 * UI control which manages visibility of columns.
 * Inspired by: https://github.com/kjantzer/backbonejs-dropdown-view.
 *
 * @class Backgrid.Extension.ColumnManagerVisibilityControl
 * @extends Backbone.View
*/
Backgrid.Extension.ColumnManagerVisibilityControl = Backbone.View.extend({
	/**
	 * @property tagName
	 * @type String
	 * @default "div"
	 */
	tagName: "div",

	/**
	 * @property className
	 * @type String
	 * @default "columnmanager-visibilitycontrol"
	 */
	className: "columnmanager-visibilitycontrol",

	/**
	 * @property defaultEvents
	 * @type Object
	 */
	defaultEvents: {
		"click": "stopPropagation"
	},

	/**
	 * @property defaultOpts
	 * @type Object
	 */
	defaultOpts: {
		width: null,
		closeOnEsc: true,
		closeOnClick: true,
		openOnInit: false,
		columnManager: null,

		// Button
		buttonTemplate: _.template("<button class='dropdown-button'>Dropdown</button>"),

		// Container
		DropdownView: DropDownView,

		// Item view
		DropdownItemView: DropDownItemView,
		dropdownItemTemplate: _.template("<span class='indicator'></span><span class='column-label'><%= label %></span>")
	},

	/**
	 * @method initialize
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

		// Listen for dropdown view events indicating to open and/or close
		this.view.on("dropdown:close", this.close, this);
		this.view.on("dropdown:open", this.open, this);
	},

	/**
	 * @method delayStart
	 * @private
	 */
	delayStart: function(){
		clearTimeout(this.closeTimeout);
		this.delayTimeout = setTimeout(this.open.bind(this), this.options.delay);
	},

	/**
	 * @method delayEnd
	 * @private
	 */
	delayEnd: function(){
		clearTimeout(this.delayTimeout);
		this.closeTimeout = setTimeout(this.close.bind(this), 300);
	},

	/**
	 * @method setup
	 * @private
	 */
	setup: function(){
		// Override element width
		if (this.options.width) {
			this.$el.width(this.options.width + "px");
		}

		var viewOptions = {
			columnManager: this.columnManager,
			DropdownItemView: this.options.DropdownItemView,
			dropdownItemTemplate: this.options.dropdownItemTemplate
		};

		// Check if a different childView has been provided, if not, use default dropdown view
		this.view = (this.options.DropdownView instanceof Backbone.View) ?
			new this.options.DropdownView(viewOptions) :
			new DropDownView(viewOptions);
	},

	/**
	 * @method setup
	 * @private
	 */
	render: function(){
		this.$el.empty();

		// Render button
		this.$el.append(this.options.buttonTemplate());

		// Render inner view
		this.view.render(); // tell the inner view to render itself
		this.$el.append(this.view.el);
		return this;
	},

	/**
	 * Convenience function to stop event propagation
	 *
	 * @method stopPropagation
	 * @param {object} e
	 * @private
	 */
	stopPropagation: function(e){
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
	},

	/**
	 * Toggle the dropdown visibility
	 *
	 * @method toggle
	 * @param {object} [e]
	 */
	toggle: function(e){
		if(this.isOpen !== true) {
			this.open(e);
		}
		else {
			this.close(e);
		}
	},

	/**
	 * Open the dropdown
	 *
	 * @method open
	 * @param {object} [e]
	 */
	open: function(e){
		clearTimeout(this.closeTimeout);
		clearTimeout(this.deferCloseTimeout);

		if(e) {
			e.stopPropagation();
		}
		// Don't do anything if already open
		if(this.isOpen) {
			return;
		}

		this.isOpen = true;
		this.$el.addClass("open");
		this.trigger("dropdown:opened");

		// Notify child view
		this.view.trigger("dropdown:opened");

		// Set position of child view
		this.setDropdownPosition();
	},

	/**
	 * Close the dropdown
	 *
	 * @method close
	 * @param {object} [e]
	 */
	close: function(e){
		// Don't do anything if already closed
		if (!this.isOpen) {
			return;
		}

		this.isOpen = false;
		this.$el.removeClass("open");
		this.trigger("dropdown:closed");

		// Notify child view
		this.view.trigger("dropdown:closed");
	},

	/**
	 * Close the dropdown on esc
	 *
	 * @method closeOnEsc
	 * @param {object} e
	 * @private
	 */
	closeOnEsc: function(e){
		if (e.which === 27) {
			this.deferClose();
		}
	},

	/**
	 * @method deferClose
	 * @private
	 */
	deferClose: function(){
		this.deferCloseTimeout = setTimeout(this.close.bind(this), 0);
	},

	/**
	 * @method stopDeferClose
	 * @private
	 */
	stopDeferClose: function(e){
		clearTimeout(this.deferCloseTimeout);
	},

	/**
	 * @method setDropdownPosition
	 * @private
	 */
	setDropdownPosition: function() {
		this.view.$el.css("top", this.$el.height());
	}
});
