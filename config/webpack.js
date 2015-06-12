"use strict";

var webpack = require("webpack");
/**
 * Get configuration for Webpack
 *
 * @see http://webpack.github.io/docs/configuration
 *      https://github.com/petehunt/webpack-howto
 *
 * @param {boolean} release True if configuration is intended to be used in
 * a release mode, false otherwise
 * @return {object} Webpack configuration
 */
module.exports = function(release) {
  return {
    entry: "./src/Backgrid.ColumnManager.js",

    output: {
      filename: (release) ? "lib/Backgrid.ColumnManager.min.js" : "lib/Backgrid.ColumnManager.js",

      // Library settings
      library: "Backgrid.Extension.ColumnManager",
      libraryTarget: "umd"
    },
    externals: {
        // require("backbone") is external and available on the global var Backbone
        "jquery": "jQuery",
        "backbone": "Backbone",
        "underscore": "_",
        "backgrid": "Backgrid"
    },

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: release ? [
      new webpack.DefinePlugin({"process.env.NODE_ENV": "production"}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ sourceMap: false }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [],

    resolve: {
      extensions: ["", ".js"],
      modulesDirectories: ["node_modules"]
    }
  };
};
