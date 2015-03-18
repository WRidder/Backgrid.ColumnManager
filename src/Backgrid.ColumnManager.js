"use strict";

// Dependencies
var _ = require("underscore");
var Backgrid = require("backgrid");

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
