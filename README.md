# Backgrid.ColumnManager
[![Build Status](https://travis-ci.org/WRidder/Backgrid.ColumnManager.svg?branch=master)](https://travis-ci.org/WRidder/Backgrid.ColumnManager)  
Manages the backgrid column collection. Adds the ability to toggle column visibility (initially and on the fly).  
[Online demo](https://wridder.github.io/backgrid-demo/)

## Example usage
```javascript
// Create column collection
var columns = new Backgrid.Columns([...]);

var territories = new Backbone.Collection([...]);

// Initialize column manager
var colManager = new Backgrid.Extension.ColumnManager(columns, {
	initialColumnsVisible: 4
});

// Add control
var colVisibilityControl = new Backgrid.Extension.ColumnManagerVisibilityControl({
	columnManager: colManager
});

$("#control").append(colVisibilityControl.render().el);

// Initialize a new Grid instance
var grid = new Backgrid.Grid({
	columns: columns,
	collection: territories
});

// Render the grid
$("#grid").append(grid.render().el);
```

## Authors
This project is originally developed by [Wilbert van de Ridder](https://github.com/WRidder/) and sponsored by [Solodev](http://www.solodev.com).
