module.exports = function(config){
  config.set({

    basePath : './',

    // List of files/patterns to load in the browser
    files : [
      // bower:js
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/lodash/lodash.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/backbone/backbone.js',
      'app/bower_components/eventEmitter/EventEmitter.js',
      'app/bower_components/eventie/eventie.js',
      'app/bower_components/imagesloaded/imagesloaded.js',
      'app/bower_components/chance/chance.js',
      'app/bower_components/dat.gui/dat.gui.js',
      'app/bower_components/mousetrap/mousetrap.js',
      // endbower
      '.dev/main.js',
      'app/**/*.spec.coffee',
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
      'karma-mocha-reporter',
      'karma-coffee-preprocessor',
      'karma-ng-html2js-preprocessor'
    ],

    // List of reporters to use
    reporters: [
      'html',
      'mocha'
    ],

    // Preprocessors to use
    preprocessors: {
      'app/**/*.html' : 'html2js',
      'app/**/*.spec.coffee': 'coffee'
    },

    // Coffeescript preprocessor config
    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: true,
        sourceMap: false
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    }

  });
};
