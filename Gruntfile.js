module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configure variables for use across grunt tasks
  var config = {
    host: 'localhost',
    autoOpen: true,
    files: {
      scripts: ['coffee/**/*.coffee'],
    },
    dirs: {
      app: 'app',
      dev: '.dev'
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

    // Connect task   - Serve site
    connect: {
      options: {
        port: 9000,
        hostname: config.host, // Change this to '0.0.0.0' to access the server from outside.
        livereload: 35729
      },

      livereload: {
        options: {
          open: config.autoOpen, // open page in default browser
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
    // watch:coffee     - 
    // watch:wiredep    -
    watch: {
      options: {
        livereload: true,
      },

      coffee: {
        files: config.files.scripts,
        tasks: ['coffee:dev']
      },

      wiredep: {
        files: ['bower.json'],
        tasks: ['wiredep:dev']
      }
    },

    // Wiredep tasks    - Inject bower dependencies automatically into source code
    wiredep: {
      dev: {
        src: ['index.html']
      }
    }

  });

  grunt.registerTask('serve', 'Compile, serve, optionally run tests', function(){
   grunt.task.run([
    'npm-install',
    'clean:dev',
    'coffee:dev',
    'wiredep:dev',
    'watch'
   ]);
  });

  grunt.registerTask('default', 'serve');
};
