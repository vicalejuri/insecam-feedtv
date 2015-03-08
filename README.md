# Angular Skeleton

A skeleton for creating angularjs applications.


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

### Install Project Specific Dependencies

This project has two kinds of dependencies in this project: tools and libraries.

Tools:

*  are for managing and testing the application
*  are specified in `package.json`.
*  are installed via `npm`, the node package manager.

Libraries:

*  are specified in `bower.json`.
*  are installed via `bower`, a client-side code package manager.
*  include angular, and any other libraries needed.

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


#### Dependencies

To use the latest version of karma, you may encounter issues if the karma client is not installed globally, `sudo npm install -g karma-cli`. Running `npm install` will set up all other packages needed for unit-testing. 



## Project's Grunt tasks


### grunt serve

This tasks compiles all of the application's assets and serves the application.

This is the default grunt task.

Command: `grunt` or `grunt serve`.

This task also gives you the option of running unit tests and serving the application simultaneously. Tests will automatically re-run in response to changes in thesource code / specs.

Command: `grunt --test` or `grunt serve --test`


### grunt test

This task runs a single run of unit tests, and outputs the result to the console.

Command: `grunt test`
