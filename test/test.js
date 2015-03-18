describe("Backgrid.Extension.ColumnManager", function() {
	var columns;
	var options;
	var instance;

	beforeEach(function() {
		columns = new Backgrid.Columns([{
				id: "col1"
			},
			{
				id: "col2"
			},
			{
				id: "col3"
			},
			{
				id: "col4"
			},
			{
				id: "col5"
			}]);

		options = {
			initialColumnsVisible: 3
		};

		instance = new Backgrid.Extension.ColumnManager(columns, options);
	});

	it("uses the given columns", function() {
		expect(instance.columns.length).toEqual(5);
		expect(instance.columns).toEqual(columns);
	});

	it("sets the renderable attribute to false for every column after given count", function() {
		// filter by attribute renderable = true
		var visibleColumns = columns.where({renderable: true});
		var inVisibleColumns = columns.where({renderable: false});

		expect(visibleColumns.length).toEqual(3);
		expect(inVisibleColumns.length).toEqual(2);
	});

	it("can hide a column by id", function() {
		// Hide a column
		instance.hideColumn("col3");

		expect(instance.columns.get("col3").get("renderable")).toEqual(false);
	});

	it("can hide a column using the column model", function() {
		// Hide a column
		instance.hideColumn(columns.get("col3"));

		expect(instance.columns.get("col3").get("renderable")).toEqual(false);
	});

	it("can show a column by id", function() {
		// Hide a column
		instance.showColumn("col4");

		expect(instance.columns.get("col4").get("renderable")).toEqual(true);
	});

	it("can show a column using the column model", function() {
		// Hide a column
		instance.showColumn(columns.get("col4"));

		expect(instance.columns.get("col4").get("renderable")).toEqual(true);
	});
});