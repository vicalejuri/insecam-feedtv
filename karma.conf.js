module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      // bower:js
      'app/bower_components/lodash/lodash.js',
      'app/bower_components/angularjs/angular.js',
      // endbower
      '.dev/main.js',
      '.test/spec.js'
    ],

    autoWatch : true,

    frameworks: [
      'jasmine',
      'jasmine-matchers'
    ],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-junit-reporter',
      'karma-jasmine-html-reporter',
      'karma-mocha-reporter'
    ],

    reporters: [
      'html',
      'mocha'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },


    preprocessors: {
      'app/**/*.html' : 'html2js'
    }


  });
};
