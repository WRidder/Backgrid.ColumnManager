# Backgrid.ColumnManager
Manages the backgrid column collection. Adds the ability to toggle column visibility (initially and on the fly) and is able to track, save and load state (width, order and visibility).
[Online demo](https://wridder.github.io/backgrid-demo/)

## Example usage
```javascript
// Create column collection
var columns = new Backgrid.Columns([...]);

var territories = new Backbone.Collection([...]);

// Initialize column manager
var colManager = new Backgrid.Extension.ColumnManager(columns, {
	initialColumnsVisible: 4,

	// State settings
	saveState: true,
	loadStateOnInit: true
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

// Listen to state changes
colManager.on("state-changed", function (state) {
	console.log("state changed: ", state);
});
colManager.on("state-saved", function () {
	console.log("state saved!");
});
```

## Authors
This project is originally developed by [Wilbert van de Ridder](https://github.com/WRidder/) and sponsored by [Solodev](http://www.solodev.com).
