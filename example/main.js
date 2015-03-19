// Create column collection
var columns = new Backgrid.Columns([{
	name: "id", // The key of the model attribute
	label: "ID", // The name to display in the header
	editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
	// Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
	cell: Backgrid.IntegerCell.extend({
		orderSeparator: ""
	})
}, {
	name: "name",
	label: "Name",
	// The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
	cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
}, {
	name: "pop",
	label: "Population",
	cell: "integer" // An integer cell is a number cell that displays humanized integers
}, {
	name: "percentage",
	label: "% of World Population",
	cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
}, {
	name: "date",
	label: "Date",
	cell: "date"
}, {
	name: "url",
	label: "URL",
	cell: "uri" // Renders the value in an HTML anchor element
}]);

var territories = new Backbone.Collection([{"name": "Afghanistan", "url": "http://en.wikipedia.org/wiki/Afghanistan", "pop": 25500100, "date": "2013-01-01", "percentage": 0.36, "id": 1}, {"name": "Albania", "url": "http://en.wikipedia.org/wiki/Albania", "pop": 2831741, "date": "2011-10-01", "percentage": 0.04, "id": 2}, {"name": "Algeria", "url": "http://en.wikipedia.org/wiki/Algeria", "pop": 37100000, "date": "2012-01-01", "percentage": 0.53, "id": 3}, {"name": "American Samoa (USA)", "url": "http://en.wikipedia.org/wiki/American_Samoa", "pop": 55519, "date": "2010-04-01", "percentage": 0.00079, "id": 4}, {"name": "Andorra", "url": "http://en.wikipedia.org/wiki/Andorra", "pop": 78115, "date": "2011-07-01", "percentage": 0.0011, "id": 5}, {"name": "Angola", "url": "http://en.wikipedia.org/wiki/Angola", "pop": 20609294, "date": "2012-07-01", "percentage": 0.29, "id": 6}, {"name": "Anguilla (UK)", "url": "http://en.wikipedia.org/wiki/Anguilla", "pop": 13452, "date": "2011-05-11", "percentage": 0.00019, "id": 7}, {"name": "Antigua and Barbuda", "url": "http://en.wikipedia.org/wiki/Antigua_and_Barbuda", "pop": 86295, "date": "2011-05-27", "percentage": 0.0012, "id": 8}, {"name": "Argentina", "url": "http://en.wikipedia.org/wiki/Argentina", "pop": 40117096, "date": "2010-10-27", "percentage": 0.57, "id": 9}, {"name": "Armenia", "url": "http://en.wikipedia.org/wiki/Armenia", "pop": 3275700, "date": "2012-06-01", "percentage": 0.046, "id": 10}, {"name": "Aruba (Netherlands)", "url": "http://en.wikipedia.org/wiki/Aruba", "pop": 101484, "date": "2010-09-29", "percentage": 0.0014, "id": 11}, {"name": "Australia", "url": "http://en.wikipedia.org/wiki/Australia", "pop": 22808690, "date": "2012-11-11", "percentage": 0.32, "id": 12}, {"name": "Austria", "url": "http://en.wikipedia.org/wiki/Austria", "pop": 8452835, "date": "2012-07-01", "percentage": 0.12, "id": 13}, {"name": "Azerbaijan", "url": "http://en.wikipedia.org/wiki/Azerbaijan", "pop": 9235100, "date": "2012-01-01", "percentage": 0.13, "id": 14}, {"name": "Bahamas", "url": "http://en.wikipedia.org/wiki/The_Bahamas", "pop": 353658, "date": "2010-05-03", "percentage": 0.005, "id": 15}, {"name": "Bahrain", "url": "http://en.wikipedia.org/wiki/Bahrain", "pop": 1234571, "date": "2010-04-27", "percentage": 0.018, "id": 16}, {"name": "Bangladesh", "url": "http://en.wikipedia.org/wiki/Bangladesh", "pop": 152518015, "date": "2012-07-16", "percentage": 2.16, "id": 17}, {"name": "Barbados", "url": "http://en.wikipedia.org/wiki/Barbados", "pop": 274200, "date": "2010-07-01", "percentage": 0.0039, "id": 18}, {"name": "Belarus", "url": "http://en.wikipedia.org/wiki/Belarus", "pop": 9459000, "date": "2012-09-01", "percentage": 0.13, "id": 19}, {"name": "Belgium", "url": "http://en.wikipedia.org/wiki/Belgium", "pop": 10839905, "date": "2010-01-01", "percentage": 0.15, "id": 20}, {"name": "Belize", "url": "http://en.wikipedia.org/wiki/Belize", "pop": 312971, "date": "2010-05-12", "percentage": 0.0044, "id": 21}, {"name": "Benin", "url": "http://en.wikipedia.org/wiki/Benin", "pop": 9352000, "date": "2012-07-01", "percentage": 0.13, "id": 22}, {"name": "Bermuda (UK)", "url": "http://en.wikipedia.org/wiki/Bermuda", "pop": 64237, "date": "2010-05-20", "percentage": 0.00091, "id": 23}, {"name": "Bhutan", "url": "http://en.wikipedia.org/wiki/Bhutan", "pop": 720679, "date": "2012-07-01", "percentage": 0.01, "id": 24}, {"name": "Bolivia", "url": "http://en.wikipedia.org/wiki/Bolivia", "pop": 10426155, "date": "2010-07-01", "percentage": 0.15, "id": 25}, {"name": "Bosnia and Herzegovina", "url": "http://en.wikipedia.org/wiki/Bosnia_and_Herzegovina", "pop": 3868621, "date": "2012-06-30", "percentage": 0.055, "id": 26}, {"name": "Botswana", "url": "http://en.wikipedia.org/wiki/Botswana", "pop": 2024904, "date": "2011-08-22", "percentage": 0.029, "id": 27}, {"name": "Brazil", "url": "http://en.wikipedia.org/wiki/Brazil", "pop": 193946886, "date": "2012-07-01", "percentage": 2.75, "id": 28}, {"name": "British Virgin Islands (UK)", "url": "http://en.wikipedia.org/wiki/British_Virgin_Islands", "pop": 29537, "date": "2010-07-01", "percentage": 0.00042, "id": 29}, {"name": "Brunei", "url": "http://en.wikipedia.org/wiki/Brunei", "pop": 393162, "date": "2011-06-20", "percentage": 0.0056, "id": 30}, {"name": "Bulgaria", "url": "http://en.wikipedia.org/wiki/Bulgaria", "pop": 7364570, "date": "2011-02-01", "percentage": 0.1, "id": 31}]);

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
