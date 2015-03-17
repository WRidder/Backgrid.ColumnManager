'use strict';

var webpack = require('webpack');
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
    entry: './src/Backbone.ColumnManager.js',

    output: {
      filename: (release) ? 'lib/Backbone.ColumnManager.min.js' : 'lib/Backbone.ColumnManager.js',

      // Library settings
      library: "Backbone.ColumnManager",
      libraryTarget: "umd"
    },
		externals: {
			// require("backbone") is external and available on the global var Backbone
			"backbone": "Backbone",
			"underscore": "_"
		},

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ sourceMap: false }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [],

    resolve: {
      extensions: ['','.js'],
      modulesDirectories: ['node_modules']
    }
  };
};
