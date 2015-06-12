var wallabyWebpack = require('wallaby-webpack');
var webpackConfig = require('./config/webpack.wallaby');
var webpackPostprocessor = wallabyWebpack(webpackConfig());

module.exports = function () {
    return {
        files: [
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
            },
            {
                pattern: "src/*.js",
                load: false
            }
        ],

        tests: [
            {
                pattern: 'test/*.js',
                load: false
            }
        ],
        //debug: true,
        postprocessor: webpackPostprocessor,
        bootstrap: function () {
            window.wallabyEnv = true;
            // Backgrid/jquery etc are available here if a console.log is used.
            window.__moduleBundler.loadTests();
        }
    }
};