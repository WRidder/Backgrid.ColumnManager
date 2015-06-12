"use strict";
var webpack = require("webpack");

module.exports = function() {
  return {
    externals: {
        "jquery": "jQuery",
        "backbone": "Backbone",
        "underscore": "_",
        "backgrid": "Backgrid"
    }
  };
};
