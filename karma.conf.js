// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html


module.exports = function (config) {


    var testFiles = [
        {pattern: 'dev/*.js', included: false},
        {pattern: 'src/**/*.js', included: false},
        'karma.bootstrap.config.js'


    ];


    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: testFiles,

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8060,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],
//    browsers: ['Chrome','Safari','Firefox','Opera','ChromeCanary'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
