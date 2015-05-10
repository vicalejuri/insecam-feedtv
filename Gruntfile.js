module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configure variables for use across grunt tasks
  var config = {
    dirs: {
      app: 'app',
      dev: '.dev',
      build: 'build',
    },
    files: {
      scripts: [
        '<%= config.dirs.app %>/main.coffee',
      ],
      tests: [
        '<%= config.dirs.app %>/**/*.spec.coffee'
      ]
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: config,

    // Autoprefixer tasks   - add browser specific prefixes to css
    // autoprefixer:build   - add browser specific prefixes to css in temporary .dev directory
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.dirs.dev %>/styles/',
          src: '**/*.css',
          dest: '<%= config.dirs.dev %>/styles/'
        }]
      }
    },

    // Clean tasks    - For erasing contents of specified directories
    // clean:dev      - Clean temporary directory created for holding compiled files during development
    clean: {
      dev: [config.dirs.dev],
      build: [config.dirs.build],
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

    // Concurrent tasks   - Allow tasks to be run concurrently
    // concurrent:test    - Allow unit-tests and watch task to be run simultaneously
    concurrent: {
      test: {
        tasks: [
          'karma:concurrent',
          'watch'
        ],
        options: {
          logConcurrentOutput: true
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

    // Copy task      - Copy files from one directory to another
    // copy:build     - Copy files from app directory to build directory during build process
    copy: {
      build: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.dirs.app %>',
            dest: '<%= config.dirs.build %>',
            src: [
              '*.html',
              '*/**/*.html',
              '!bower_components/**/*.html',
            ]
          }
        ]
      }
    },

    // Filerev tasks    - Rename files for browser caching purposes
    // filerev:build    - Filerev tasks used during build process
    filerev: {
      build: {
        src: [
          '<%= config.dirs.build %>/scripts/{,*/}*.js',
          '<%= config.dirs.build %>/styles/{,*/}*.css',
        ]
      }
    },

    // gh-pages task    - Push build to the gh-pages branch.
    'gh-pages': {
      options: {
        base: '<%= config.dirs.build %>',
      },
      src: ['**']
    },

    // Htmlmin tasks    - Minify html files
    // htmlmin:build    - Minify html files during build process
    htmlmin: {
      build: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dirs.build %>',
          src: ['*.html', '*/**/*.html'],
          dest: '<%= config.dirs.build %>'
        }]
      }
    },

    // Karma - test runner
    // karma:concurrent   - Run test in the background
    // karma:single       - Run tests once
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      // Keep tests running in the background
      concurrent: {
        singleRun: false
      },
      // Run tests once
      single: {
        singleRun: true
      }
    },

    // Sass tasks    - SCSS and SASS compilation
    // sass:dev      - Compile .scss and .sass files to temporary directory during development
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.dirs.app %>/styles',
          src: ['**/*.{scss,sass}'],
          dest: '<%= config.dirs.dev %>/styles',
          ext: '.css'
        }]
      }
    },

    // UseminPrepare tasks  - Reads HTML for usemin blocks to enable smart builds that automatically
    //                        concat, minify and revision files. Creates configurations in memory so
    //                        additional tasks can operate on them
    // useminPrepare:build  - UseminPrepare task for build process
    useminPrepare: {
      build: {
        src: ['<%= config.dirs.app %>/index.html'],
        options: {
          staging: '<%= config.dirs.dev %>',
          dest: '<%= config.dirs.build %>',
          flow: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Usemin tasks         - Performs rewrites based on filerev and the useminPrepare configuration
    // usemin:html          - Usemin task for .html files
    // usemin:css          - Usemin task for .css files
    usemin: {
      html: ['<%= config.dirs.build %>/**/*.html'],
      css: ['<%= config.dirs.build %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= config.dirs.build %>']
      }
    },

    // Watch tasks      - Watch for changes in specified directories, and re-run specified task(s)
    // watch:coffee     - Watch coffeescript files, re-compile coffeescripts
    // watch:sass       - Watch .scss and .sass files, re-compile on change
    // watch:wiredep    - Watch bower.json for new bower_components, and inject new dependencies
    // watch:livereload - Trigger livereload on update of html or scripts
    watch: {
      options: {
        livereload: true
      },

      coffee: {
        files: config.files.scripts,
        tasks: ['coffee:dev']
      },

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dirs.app %>/**/*.html',
          '<%= config.dirs.dev %>/**/*.js'
        ]
      },

      sass: {
        files: [
          '<%= config.dirs.app %>/styles/**/*.{scss,sass}'
        ],
        tasks: ['sass']
      },

      wiredep: {
        files: ['bower.json'],
        tasks: ['wiredep:dev', 'wiredep:test']
      }
    },

    // Wiredep tasks    - Inject bower dependencies automatically into source code
    // wiredep:dev      - Inject bower dependencies into html pages
    // wiredep:test     - Inject bower dependencies into karma config
    wiredep: {
      dev: {
        src: ['<%= config.dirs.app %>/index.html']
      },

      test:{
        src: 'karma.conf.js',
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi, // Wire dependencies between '// bower:extension' and '// endbower'
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    }

  });

  // Custom tasks

  // test                     - Run a single run of unit tests
  //    [--no-install-deps]   - Skip dependency installation.
  grunt.registerTask('test', 'Run unit tests', function(){
    if(! grunt.option('no-install-deps')){
      grunt.task.run([
        'npm-install',
      ]);
    }

    grunt.task.run([
      'wiredep:test',
      'clean:dev',
      'coffee:dev',
      'karma:single'
    ]);
  });

  // build                    - Build app, ready for deployment
  //    [--no-install-deps]   - Skip dependency installation.
  grunt.registerTask('build', 'Build, ready for deployment', function(){
    if(! grunt.option('no-install-deps')){
      grunt.task.run([
        'npm-install',
      ]);
    }

    grunt.task.run([
      'clean:dev',
      'coffee:dev',
      'sass:dev',
      'autoprefixer:dev',
      'wiredep:dev',
      'clean:build',
      'useminPrepare',
      'concat',
      'copy:build',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'htmlmin',
    ]);
  });

  grunt.registerTask('deploy', 'Build app, deploy to gh-pages branch', function(){
    grunt.task.run([
      'build',
      'gh-pages',
    ]);
  });

  // serve                    - Compile site assets, serve site
  //    [--test]              - run unit tests concurrently
  //    [--no-install-deps]   - Skip dependency installation.
  grunt.registerTask('serve', 'Compile, serve, optionally run tests', function(){
    if(! grunt.option('no-install-deps')){
      grunt.task.run([
        'npm-install',
      ]);
    }

    grunt.task.run([
      'clean:dev',
      'coffee:dev',
      'sass:dev',
      'autoprefixer:dev',
      'wiredep:dev',
      'connect:livereload'
    ]);

    if(grunt.option('test')){
      grunt.task.run([
        'wiredep:test',
        'concurrent:test'
      ]);
    } else {
      grunt.task.run(['watch']);
    }
  });

  // default task   - run by grunt when no task is specified
  grunt.registerTask('default', 'serve');
};
