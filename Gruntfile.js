module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var config = {
    
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: config,
    
    coffee: {
      compile: {
        files: {
          '.tmp/main.js': ['coffee/**/*.coffee']
        }
      }
    }
  });

  grunt.registerTask('serve', 'Compile, serve, optionally run tests', function(){
  });

  grunt.registerTask('default', 'serve');
};
