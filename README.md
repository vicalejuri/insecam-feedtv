# Coffeescript App Skeleton

A skeleton for creating web applications in Coffeescript (and SCSS).


## Installing dependencies


### Install node.js and node package manager (npm).

From Debian and Ubuntu based distributions, use the following commands:

```
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm
```

For other distributions, you will not need the nodejs-legacy package. For information about other distributions, see:
[Installing node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)


### Install Grunt Client

To use the `grunt-cli`, it must be installed globally.

```
sudo npm install -g grunt-cli
```


### Install SASS Ruby Gem

This gem is required for compilation of `.scss` and `.sass` files to `.css`. Before installing the gem, ensure Ruby and Ruby's Gem package manager are installed. Then, install the `sass` gem:

```
sudo gem install sass
```


### Install Project Specific Dependencies

This project has two kinds of dependencies: tools and libraries.

Tools:

*  are for managing and testing the application
*  are specified in `package.json`.
*  are installed via `npm`, the node package manager.

Libraries:

*  are the client-side dependencies which actually get shipped with the app.
*  are specified in `bower.json`.
*  are installed via `bower`, a client-side code package manager.

In this project, `npm install` has been configured to automatically run `bower install`, so we can simply run:

```
npm install
```

This will create the following folders:

* `node_modules` - contains the npm packages for tools needed.
* `app/bower_components` - contains bower packages for libraries needed.



## Testing


### Unit Tests

Unit tests are written in [Jasmine 2.0](http://jasmine.github.io/), and run with the [Karma Test Runner](http://karma-runner.github.io/0.12/index.html). We provide a Karma configuration file to run them.

* Configuration for karma is found in `karma.conf.js`
* Unit tests are to be named as follows: `*.spec.coffee`



## Grunt tasks


### grunt serve

This tasks compiles all of the application's assets and serves the application.

This is the default grunt task.

Command: `grunt` or `grunt serve`

This task also gives you the option of running unit tests and serving the application simultaneously. Tests will automatically re-run in response to changes in thesource code / specs.

Command: `grunt --test` or `grunt serve --test`

If you do not wish to install npm and bower dependencies before serving, an optional flag is available.

Command: `grunt --no-install-deps`


### grunt test

This task runs a single run of unit tests, and outputs the result to the console.

Command: `grunt test`

If you do not wish to install npm and bower dependencies before running the tests, an optional flag is available.

Command: `grunt test --no-install-deps`


### grunt build

This tasks compiles all of the application's assets and builds the app, ready for deployment.

Command: `grunt build`

If you do not wish to install npm and bower dependencies before building, an optional flag is available.

Command: `grunt build --no-install-deps`


### grunt deploy

Builds the app and deploys it to the `gh-pages` branch on Github.

Command: `grunt deploy`

If you do not wish to install npm and bower dependencies before deploying, an optional flag is available.

Command: `grunt deploy --no-install-deps`
