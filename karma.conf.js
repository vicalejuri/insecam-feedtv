module.exports = function(config){
  config.set({

    basePath : './',

    // List of files/patterns to load in the browser
    files : [
      // bower:js
      'app/bower_components/lodash/lodash.js',
      'app/bower_components/angularjs/angular.js',
      // endbower
      '.dev/main.js',
      '.test/spec.js'
    ],

    // Enable watching files and executing the tests whenever one of the above files changes
    autoWatch : true,

    frameworks: [
      'jasmine',
      'jasmine-matchers'
    ],

    // List of browsers to launch and capture
    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-jasmine-html-reporter',
      'karma-mocha-reporter'
    ],

    // List of reporters to use
    reporters: [
      'html',
      'mocha'
    ],

    // Preprocessors to use
    preprocessors: {
      'app/**/*.html' : 'html2js'
    }

  });
};
