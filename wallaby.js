var wallabyWebpack = require('wallaby-webpack');
var webpackConfig = require('./config/webpack.wallaby');
var webpackPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function () {
    return {
        files: [
            {
                pattern: "src/*.js",
                load: false
            },
            {
                pattern: "node_modules/jquery/dist/jquery.min.js",
                instrument: false
            },
            {
                pattern: "node_modules/underscore/underscore-min.js",
                instrument: false
            },
            {
                pattern: "node_modules/backbone/backbone-min.js",
                instrument: false
            },
            {
                pattern: "node_modules/backgrid/lib/backgrid.js",
                instrument: false
            }
        ],

        tests: [
            {
                pattern: 'test/*.js',
                load: true
            }
        ],
        debug: true,
        postprocessor: webpackPostprocessor,
        bootstrap: function () {
            window.__moduleBundler.loadTests();
        }
    }
};