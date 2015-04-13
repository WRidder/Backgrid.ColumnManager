/*global jasmine, describe, beforeEach, it, expect, spyOn, Backgrid */
"use strict";
describe("Backgrid.Extension.ColumnManager - Visibility management", function () {
  var columns;
  var options;
  var instance;

  beforeEach(function () {
    columns = new Backgrid.Columns([{
        id: "col1",
        name: "col1"
      },
      {
        id: "col2",
        name: "col2"
      },
      {
        id: "col3",
        name: "col3"
      },
      {
        id: "col4",
        name: "col4"
      },
      {
        id: "col5",
        name: "col5"
      }]);

    options = {
      initialColumnsVisible: 3
    };

    // Stub storage functionality
    Backgrid.Extension.ColumnManager.prototype.getStorage = function() {
      var dataStore = {};
      return {
        setItem: function(key, data) {
          dataStore[key] = data.toString();
        },
        getItem: function(key) {
          return dataStore[key] || null;
        }
      };
    };

    instance = new Backgrid.Extension.ColumnManager(columns, options);
  });

  it("uses the given columns", function () {
    expect(instance.columns.length).toEqual(5);
    expect(instance.columns).toEqual(columns);
  });

  it("sets the renderable attribute to false for every column after given count", function () {
    // filter by attribute renderable = true
    var visibleColumns = columns.where({renderable: true});
    var inVisibleColumns = columns.where({renderable: false});

    expect(visibleColumns.length).toEqual(3);
    expect(inVisibleColumns.length).toEqual(2);
  });

  it("can hide a column by id", function () {
    // Hide a column
    instance.hideColumn("col3");

    expect(instance.columns.get("col3").get("renderable")).toEqual(false);
  });

  it("can hide a column using the column model", function () {
    // Hide a column
    instance.hideColumn(columns.get("col3"));

    expect(instance.columns.get("col3").get("renderable")).toEqual(false);
  });

  it("can show a column by id", function () {
    // Hide a column
    instance.showColumn("col4");

    expect(instance.columns.get("col4").get("renderable")).toEqual(true);
  });

  it("can show a column using the column model", function () {
    // Hide a column
    instance.showColumn(columns.get("col4"));

    expect(instance.columns.get("col4").get("renderable")).toEqual(true);
  });

  it("can toggle the visibility of a column", function () {
    instance.toggleColumnVisibility(columns.get("col1"));
    expect(instance.columns.get("col1").get("renderable")).toEqual(false);
    instance.toggleColumnVisibility(columns.get("col1"));
    expect(instance.columns.get("col1").get("renderable")).toEqual(true);
    instance.toggleColumnVisibility(columns.get("col1"));
    expect(instance.columns.get("col1").get("renderable")).toEqual(false);
  });

  it("can return the column collection", function () {
    expect(instance.getColumnCollection()).toEqual(columns);
  });
});

describe("Backgrid.Extension.ColumnManager - State management", function () {
  var OrderableColumns = Backgrid.Columns.extend({
    sortKey: "displayOrder",
    comparator: function (item) {
      return item.get(this.sortKey) || 1e6;
    },
    setPositions: function () {
      _.each(this.models, function (model, index) {
        // If a displayOrder is defined already, do not touch
        model.set("displayOrder", model.get("displayOrder") || index + 1, {silent: true});
      });
      return this;
    }
  });

  var nameCompare = function(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  };

  var columns;
  var options;
  var instance;
  var evtHandlerSpy;

  beforeEach(function () {
    var columnsDefinition = ([
      {
        id: "col1",
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        id: "col2",
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        id: "col3",
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        id: "col4",
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        id: "col5",
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ]);

    columns = new OrderableColumns(columnsDefinition);
    columns.setPositions().sort();

    options = {
      initialColumnsVisible: null,

      // State options
      trackSize: true,
      trackOrder: true,
      saveState: true,
      saveStateLocation: "localStorage",
      loadStateOnInit: true
    };

    // Stub storage functionality
    Backgrid.Extension.ColumnManager.prototype.getStorage = function() {
      var dataStore = {};
      return {
        setItem: function(key, data) {
          dataStore[key] = data.toString();
        },
        getItem: function(key) {
          return dataStore[key] || null;
        }
      };
    };

    // Spies
    evtHandlerSpy = spyOn(Backgrid.Extension.ColumnManager.prototype, "stateUpdateHandler").and.callThrough();

    instance = new Backgrid.Extension.ColumnManager(columns, options);
  });

  // Listen to events
  it("listens to resize events", function () {
    columns.first().trigger("resize");
    expect(evtHandlerSpy.calls.count()).toEqual(1);
  });

  it("listens to ordering events", function () {
    columns.trigger("ordered");
    expect(evtHandlerSpy.calls.count()).toEqual(1);
  });

  it("listens to ordering events", function () {
    columns.first().set("renderable", false);
    expect(evtHandlerSpy.calls.count()).toEqual(1);
  });

  // Emit events
  it("emits a 'state-saved' event when the state is saved manually", function () {
    var stateSavedEventCount = 0;
    instance.on("state-saved", function () {
      stateSavedEventCount++;
    });
    instance.saveState();

    expect(stateSavedEventCount).toEqual(1);
  });

  it("emits a 'state-changed' and 'state-saved' event when a column is resized", function () {
    var stateChangedEventCount = 0;
    instance.on("state-changed", function () {
      stateChangedEventCount++;
    });
    var stateSavedEventCount = 0;
    instance.on("state-saved", function () {
      stateSavedEventCount++;
    });
    columns.first().trigger("resize");

    expect(stateChangedEventCount).toEqual(1);
    expect(stateSavedEventCount).toEqual(1);
  });

  it("emits a 'state-changed' and 'state-saved' event when the collection is reordered", function () {
    var stateChangedEventCount = 0;
    instance.on("state-changed", function () {
      stateChangedEventCount++;
    });
    var stateSavedEventCount = 0;
    instance.on("state-saved", function () {
      stateSavedEventCount++;
    });

    columns.trigger("ordered");

    expect(stateChangedEventCount).toEqual(1);
    expect(stateSavedEventCount).toEqual(1);
  });

  it("emits a 'state-changed' and 'state-saved' event when a the visibility of a model is changed", function () {
    var stateChangedEventCount = 0;
    instance.on("state-changed", function () {
      stateChangedEventCount++;
    });
    var stateSavedEventCount = 0;
    instance.on("state-saved", function () {
      stateSavedEventCount++;
    });

    columns.first().set("renderable", false);

    expect(stateChangedEventCount).toEqual(1);
    expect(stateSavedEventCount).toEqual(1);
  });

  // saveState and getState method
  it("saves state on request", function () {
    var stateSaveSuccess = instance.saveState();
    var result = [
      {
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    expect(stateSaveSuccess).toEqual(true);
    expect(instance.getState()[0]).toEqual(jasmine.objectContaining(result[0]));
    expect(instance.getState()[4]).toEqual(jasmine.objectContaining(result[4]));
  });

  it("returns current state on request", function () {
    expect(instance.getState()).toEqual(instance.state);
  });

  // State verification
  it("strictly verifies the validity of a given state with regards to the column collection", function () {
    var correctState = [
      {
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    var inCorrectState1 = [
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    var inCorrectState2 = [
      {
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col6",
        width: "*",
        displayOrder: 5
      }
    ];

    var inCorrectState3 = [
      {
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    expect(instance.checkStateValidity(correctState)).toEqual(true);
    expect(instance.checkStateValidity(inCorrectState1)).toEqual(false);
    expect(instance.checkStateValidity(inCorrectState2)).toEqual(false);
    expect(instance.checkStateValidity(inCorrectState3)).toEqual(false);
  });

  it("loosely verifies the validity of a given state with regards to the column collection", function () {
    var correctState = [
      {
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    var correctState1 = [
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    var correctState2 = [
      {
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];

    // Name key should be present
    var inCorrectState = [
      {
        width: 200,
        displayOrder: 2
      }
    ];

    // Width should be number
    var inCorrectState1 = [
      {
        name: "col1",
        width: false
      }
    ];

    // Displayorder should be number
    var inCorrectState2 = [
      {
        name: "col1",
        displayOrder: false
      }
    ];

    // renderable should be boolean
    var inCorrectState3 = [
      {
        name: "col1",
        renderable: "no boolean"
      }
    ];

    // Set option
    instance.options.stateChecking = "loose";

    expect(instance.checkStateValidity(correctState)).toEqual(true);
    expect(instance.checkStateValidity(correctState1)).toEqual(true);
    expect(instance.checkStateValidity(correctState2)).toEqual(true);
    expect(instance.checkStateValidity(inCorrectState)).toEqual(false);
    expect(instance.checkStateValidity(inCorrectState1)).toEqual(false);
    expect(instance.checkStateValidity(inCorrectState2)).toEqual(false);
    expect(instance.checkStateValidity(inCorrectState3)).toEqual(false);
  });

  // Applying state to column collection
  it("applies a given state to the collection", function() {
    var newState = [
      {
        name: "col1",
        width: 300,
        displayOrder: 3,
        renderable: false
      },
      {
        name: "col2",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col3",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col4",
        width: 500,
        displayOrder: 5,
        renderable: false
      },
      {
        name: "col5",
        displayOrder: 4
      }
    ];

    // Track events
    var evtRenderableCount = 0;
    columns.on("change:renderable", function () {
      evtRenderableCount++;
    });

    var evtOrderedCount = 0;
    columns.on("ordered", function () {
      evtOrderedCount++;
    });

    var evtResizeCount = 0;
    columns.on("resize", function () {
      evtResizeCount++;
    });

    // Set state
    instance.setState(newState, true);

    // Verify events
    expect(evtRenderableCount).toEqual(2);
    expect(evtOrderedCount).toEqual(1);
    expect(evtResizeCount).toEqual(4);

    // Verify values
    var columnJson = instance.columns.toJSON().sort(nameCompare);
    // 0
    expect(columnJson[0].name).toEqual("col1");
    expect(columnJson[0].width).toEqual(300);
    expect(columnJson[0].displayOrder).toEqual(3);
    expect(columnJson[0].renderable).toEqual(false);

    // 1
    expect(columnJson[1].name).toEqual("col2");
    expect(columnJson[1].width).toEqual(100);
    expect(columnJson[1].displayOrder).toEqual(1);

    // 2
    expect(columnJson[2].name).toEqual("col3");
    expect(columnJson[2].width).toEqual(200);
    expect(columnJson[2].displayOrder).toEqual(2);

    // 3
    expect(columnJson[3].name).toEqual("col4");
    expect(columnJson[3].width).toEqual(500);
    expect(columnJson[3].displayOrder).toEqual(5);
    expect(columnJson[3].renderable).toEqual(false);

    // 4
    expect(columnJson[4].name).toEqual("col5");
    expect(columnJson[4].width).toEqual("*");
    expect(columnJson[4].displayOrder).toEqual(4);
    expect(columnJson[4].renderable).toEqual(true);
  });

  it("can initialize with a state", function() {
    var cols = new OrderableColumns([
      {
        id: "col1",
        name: "col1",
        width: 100,
        displayOrder: 1
      },
      {
        id: "col2",
        name: "col2",
        width: 200,
        displayOrder: 2
      },
      {
        id: "col3",
        name: "col3",
        width: 300,
        displayOrder: 3
      },
      {
        id: "col4",
        name: "col4",
        width: 400,
        displayOrder: 4
      },
      {
        id: "col5",
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ]);

    var newState = [
      {
        name: "col1",
        width: 300,
        displayOrder: 3,
        renderable: false
      },
      {
        name: "col2",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col3",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col4",
        width: 500,
        displayOrder: 5,
        renderable: false
      },
      {
        name: "col5",
        displayOrder: 4
      }
    ];

    var opts = {
      initialColumnsVisible: 3,

      // State options
      trackSize: true,
      trackOrder: true,
      saveState: true,
      saveStateLocation: "localStorage",
      loadStateOnInit: true
    };

    // Track events
    var evtRenderableCount = 0;
    cols.on("change:renderable", function () {
      evtRenderableCount++;
    });

    var evtOrderedCount = 0;
    cols.on("ordered", function () {
      evtOrderedCount++;
    });

    var evtResizeCount = 0;
    cols.on("resize", function () {
      evtResizeCount++;
    });

    var localInstance = new Backgrid.Extension.ColumnManager(cols, opts, newState);

    // Verify events
    expect(evtRenderableCount).toEqual(2);
    expect(evtOrderedCount).toEqual(1);
    expect(evtResizeCount).toEqual(4);

    // Verify values
    var columnJson = localInstance.columns.toJSON().sort(nameCompare);

    // 0
    expect(columnJson[0].name).toEqual("col1");
    expect(columnJson[0].width).toEqual(300);
    expect(columnJson[0].displayOrder).toEqual(3);
    expect(columnJson[0].renderable).toEqual(false);

    // 1
    expect(columnJson[1].name).toEqual("col2");
    expect(columnJson[1].width).toEqual(100);
    expect(columnJson[1].displayOrder).toEqual(1);

    // 2
    expect(columnJson[2].name).toEqual("col3");
    expect(columnJson[2].width).toEqual(200);
    expect(columnJson[2].displayOrder).toEqual(2);

    // 3
    expect(columnJson[3].name).toEqual("col4");
    expect(columnJson[3].width).toEqual(500);
    expect(columnJson[3].displayOrder).toEqual(5);
    expect(columnJson[3].renderable).toEqual(false);

    // 4
    expect(columnJson[4].name).toEqual("col5");
    expect(columnJson[4].width).toEqual("*");
    expect(columnJson[4].displayOrder).toEqual(4);
    expect(columnJson[4].renderable).toEqual(true);
  });

  // storage functionality
  it("loads state from storage if available", function () {
    // Set storage to actual local storage
    Backgrid.Extension.ColumnManager.prototype.getStorage = function() {
      return localStorage;
    };

    // Set item in storage
    var storedState = [
      {
        name: "col1",
        width: 300,
        displayOrder: 3
      },
      {
        name: "col2",
        width: 100,
        displayOrder: 1
      },
      {
        name: "col3",
        width: 200,
        displayOrder: 2
      },
      {
        name: "col4",
        width: 500,
        displayOrder: 4
      },
      {
        name: "col5",
        width: "*",
        displayOrder: 5
      }
    ];
    localStorage.setItem("backgrid-colmgr", JSON.stringify(storedState));

    var localInstance = new Backgrid.Extension.ColumnManager(columns, options);
    expect(localInstance.getState()[0]).toEqual(jasmine.objectContaining(storedState[0]));
    expect(localInstance.getState()[4]).toEqual(jasmine.objectContaining(storedState[4]));

    // Clear local storage
    localStorage.clear();
  });
});
