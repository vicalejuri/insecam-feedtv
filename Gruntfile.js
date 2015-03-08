module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configure variables for use across grunt tasks
  var config = {
    dirs: {
      app: 'app',
      dev: '.dev'
    },
    files: {
      scripts: ['<%= config.dirs.app %>/**/*.coffee'],
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: config,
    
    // Clean tasks    - For erasing contents of specified directories
    // clean:dev      - Clean temporary directory created for holding compiled files during development
    clean: {
      dev: [config.dirs.dev]
    },

    // Coffee tasks   - Coffeescript compilation
    // coffee:dev     - Compile coffeescript files to temporary directory during development
    coffee: {
      dev: {
        files: {
          '<%= config.dirs.dev %>/main.js': config.files.scripts 
        }
      }
    },

    // Connect task   
    // connect:livereload - Serve site on port 9000
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost', // Change this to '0.0.0.0' to access the server from outside.
        livereload: 35729
      },

      livereload: {
        options: {
          open: true, // open page in default browser
          middleware: function (connect) {
            return [
              connect.static(config.dirs.dev),
              connect.static(config.dirs.app)
            ];
          }
        }
      }
    },

    // Watch tasks      - Watch for changes in specified directories, and re-run specified task(s)
    // watch:coffee     - Watch coffeescript files, re-compile coffeescripts
    // watch:wiredep    - Watch bower.json for new bower_components, and inject new dependencies
    // watch:livereload - Trigger livereload on update of html or scripts 
    watch: {
      options: {
        livereload: true,
      },

      coffee: {
        files: config.files.scripts,
        tasks: ['coffee:dev']
      },

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
        },
        files: [
          '<%= config.dirs.app %>/**/*.html',
          '<%= config.dirs.dev %>/**/*.js'
        ]
      },

      wiredep: {
        files: ['bower.json'],
        tasks: ['wiredep:dev']
      }
    },

    // Wiredep tasks    - Inject bower dependencies automatically into source code
    // wiredep:dev      - Injects bower dependencies into html pages
    wiredep: {
      dev: {
        src: ['<%= config.dirs.app %>/index.html']
      }
    }

  });

  grunt.registerTask('serve', 'Compile, serve, optionally run tests', function(){
   grunt.task.run([
    'npm-install',
    'clean:dev',
    'coffee:dev',
    'wiredep:dev',
    'connect:livereload',
    'watch'
   ]);
  });

  grunt.registerTask('default', 'serve');
};
