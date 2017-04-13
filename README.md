# Protractor and WebRTC

**!!! THIS IS STILL WORK IN PROGRESS !!!**

This project is a code lab to teach the basics for creating end-to-end tests with [Protractor](http://www.protractortest.org/#/) for [WebRTC](http://webrtc.org/) applications.

![WebRTC Sample app during end-to-end test execution](https://s3-sa-east-1.amazonaws.com/helloworld-wlsf82/webrtc-sample.png)

Protractor is an end-to-end test framework for AngularJS applications, but it can be used for non-AngularJS apps as well, as will be shown in this code lab.

With Protractor, tests are executed against web applications running in real browsers, interacting with it as users would.

WebRTC stands from Web Real Time Communication, and it is very important to test such applications in an end-to-end way.

Creating end-to-end tests for real time communication apps is not exactly the same as it is for other kind of apps, where all the tests can run in a single instance of browser.

When talking about WebRTC apps, we need to keep in mind that the core of such application is communication, and this means that clients in two or more browsers will be interacting with each other using the app, so, automated tests needs to ensure that the correct behavior is happening for real use cases.

## Code lab structure

Each lesson in this code lab is already solved in its specific directory, but we will create it from scratch in the project's root directory, and you can check the final solution for each lesson if you need.

Note: You can find all lessons inside the directory named as this.

## Sample application

We will use a sample WebRTC application based on the following Google's code lab for all lessons: https://codelabs.developers.google.com/codelabs/webrtc-web/#8.

Note: there is no need to clone the app from the Google's code lab, since this is already part of this project, with minor modifications.

## Pre-requirements

- Basic knowledge of JavaScritp
- Computer with camera (app requirement)
- Node.js v6.x+ (use this URL to download Node.js in case you don't have it yet: https://nodejs.org/)
- Chrome (due to WebRTC compatibility)

## Lesson 0 - Setup

In this lesson you will learn:

- How to install the application dependencies
- How to start the app
- How to install protractor and a test report as dev dependencies
- How to create a basic protractor configuration for running end-to-end tests
- And how to create and run a npm test script

### Installing the app dependencies

After cloning the project, from root directory where it was downloaded, run the below command to install the application dependencies:

`npm i`

This command will basically install the project dependencies defined in the `package.json` file.

With all the dependencies installed, you can already start the app to test it out.

### Starting the app

This WebRTC sample application is based on Node.js, this means that node will be used to start it.

From the project's root directory, run the below command to start the app:

`node inde.jx`

With the app running, open the Chrome browser and type the following URL: http://localhost:8080

If everything went ok, you should see the WebRTC Sample app.

Note: This app requires camera access, so, in the first time you access it, you may allow the browser to access your computer's camera.

After allowing the browser to access the camera, you should see yourself in the app.

Now that everything is working, it's time to install protractor, so that you can create automated end-to-end tests.

### Protractor and test report installation

Protractor is also Node.js based, so we will use npm (node package manager) to install it.

From the project's root directory (in another console's tab), run the bellow command:

`npm i protractor@5.0.0 jasmine-spec-reporter -D`

Note: It is necessary to define the version 5.0.0 of protractor due to an issue with version 5.1.x related to the usage of `forkNewDriverInstance()` and `browser.ignoreSynchronization`. This specific things will be explained later during the course.

At the same time, we are installing a node module called `jasmine-spec-reporter`, that will be used for better test reporting.

The `-D` argument will install protractor as a dev dependency.

After the protractor's successful installation, the following code should be displayed in the `package.json` file (the `jasmine-spec-reporter` version may be newer):

```
"devDependencies": {
  "jasmine-spec-reporter": "^3.2.0",
  "protractor": "^5.0.0"
}
```

With protractor correctly installed we can already start configuring it.

### Protractor configuration setup

The first thing needed to start using protractor is to setup some basic configurations.

Follow the instructions:

In the project's root directory, create a `test` folder, and inside this folder create a file named `protractor.conf.js`.

After creating the file, add the following code snippet to it (each part will be explained):

```
"use strict";

const SpecReporter = require("jasmine-spec-reporter").SpecReporter;

module.exports.config = {
    "specs": ["spec.js"],
    "capabilities": {
        "browserName": "chrome",
        "chromeOptions": {
            "args": [
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream"
            ]
        }
    },
    onPrepare() {
        browser.ignoreSynchronization = true;
        jasmine.getEnv().addReporter(new SpecReporter({
            "displayFailuresSummary": true,
            "displayFailedSpec": true,
            "displaySuiteNumber": true,
            "displaySpecDuration": true
        }));
    },
    "jasmineNodeOpts": {
        "defaultTimeoutInterval": 10000
    }
};
```

First of all, we are defining `"use strict;"` because all the testing code will be written using ECMAScript 2015 syntax.

Secondly we are requiring a module called `jasmine-spec-reporter` and storing it in a variable called `SpecReporter`. This will be used for a better test report in the console.

Then we are exporting a config module, where all configurations needed for protractor to run the tests will be defined.

Each configuration will be explained below:

#### specs

This attribute has an array as its value. The values defined inside this array will be the name of the test files, and they need to be quoted and comma separated.

Note: Since we are defining only one value for the array, there is no need for comma.

#### capabilities

This is the attribute that defines the browser where the tests will be executed against.
For the capabilities config we are also defining some arguments for the `chromeOptions`, to automatically allow the browser's camera usage and to fake media stream.

#### onPrepare()

This is an important configuration.

Protractor is and end-to-end test framework for AngularJS applications, so, to use it for non-AngularJS apps, it is necessary to define the configuration `browser.ignoreSynchronization = true;`. This configuration tells protractor to not look for Angular when running the tests, and it is defined in the `onPrepare` function since this is a callback function called once protractor is ready and available, and before the specs are executed.

In the `onPrepare` function we are also defining some specific `jasmine-spec-reporter` configurations for better test reporting.

#### jasmineNodeOpts

By default, protractor uses [Jasmine](https://jasmine.github.io) as a base framework.
In the `jasmineNodeOpts` configuration we are setting the `"defaultTimeoutInterval"` to `10000` milliseconds. We are basically overwriting the default configuration that is `30000` milliseconds, once the tests that we will write are meant to be very fast, and in case of timing issues, we don't want to make a test case wait 30 seconds before failing.

### NPM test script

To ease running the tests we will use npm scripts.

From the project's root directory, update the `package.json` file with the following code, right below the project's description:

```
"scripts": {
  "test": "./node_modules/.bin/webdriver-manager update && ./node_modules/.bin/protractor test/protractor.conf.js"
},
```

Protractor needs `webdriver-manager` to be updated before running the tests, so, in the npm script we are defining two commands that will be executed one after the other. The first command updates the webdriver, and the second command runs the protractor configuration file.

After updating and saving the `package.json` file, from the project's root directory, run the below command:

`npm test`

If everything went ok you should see an output like this:

```
> webdriver-manager update && ./node_modules/.bin/protractor test/protractor.conf.js

[15:26:53] I/update - chromedriver: file exists /Users/foobaruser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.26mac64.zip
[15:26:53] I/update - chromedriver: unzipping chromedriver_2.26mac64.zip
[15:26:53] I/update - chromedriver: setting permissions to 0755 for /Users/foobaruser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.26
[15:26:53] I/update - chromedriver: 2.26 up to date
[15:26:54] I/update - selenium standalone: file exists /Users/foobaruser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar
[15:26:54] I/update - selenium standalone: 2.53.1 up to date
[15:26:54] I/update - geckodriver: file exists /Users/foobaruser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.12.0-macos.tar.gz
[15:26:54] I/update - geckodriver: unzipping geckodriver-v0.12.0-macos.tar.gz
[15:26:54] I/update - geckodriver: setting permissions to 0755 for /Users/foobaruser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.12.0
[15:26:54] I/update - geckodriver: v0.12.0 up to date
[15:26:55] I/local - Starting selenium standalone server...
[15:26:55] I/launcher - Running 1 instances of WebDriver
[15:26:55] I/local - Selenium standalone server started at http://192.168.0.19:53953/wd/hub
Started


No specs found
Finished in 0.001 seconds
[15:26:56] I/local - Shutting down selenium standalone server.
[15:26:56] I/launcher - 0 instance(s) of WebDriver still running
[15:26:56] I/launcher - chrome #01 passed
```

Also, while the npm script is running, you should see the Chrome browser being automatically opened and closed.

And with this we finish lesson 0. Move on to lesson 1 to create the first test.

## Lesson 1 - First test

Now that we have an app up and running and the basic configurations needed for protractor, it is time to create the first test.

In this lesson you will learn:

- How to create a simple end-to-end test
- And how to run the first test

### Test creation

This first test will not focus on specific WebRTC stuff, but to the protractor basics. Later, with some knowledge about how to create tests with protractor we will evolve to specific test for WebRTC applications.

In the already created test folder, create a file called `spec.js`. This is the file that will store our test suite.

Then add the following code snippet to the just created file (every part of the code willl be explained):

```
"use strict";

describe("WebRTC Sample", () => {
    it("should show title", () => {
        browser.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(element(by.css("h1")).getText()).toEqual("WebRTC Sample");
    });
});
```

Again, in the beginning we are using `"use strict";` due to ECMAScript 2015 syntax.

Then we are defining a `desbribe` statement, that receives two arguments, the first one is a string that will name the test suite (in this case `"WebRTC Sample"`), and the second argument is a callback function.

Then we define an `it` statement. This statement also receives a string as the first argument and a callback function and the second argument. The first argument will basically name our first test case, and the second one will run all the steps of our test.

And finally we define the steps for the test to run.

The `browser.get("http://localhost:8080");` code will access the defined URL in the Chrome browser that will be automatically opened by the protractor configuration file.

Then we have two expectations, one to check that the title of the page is equal to `"WebRTC Sample"` and another to check that a `h1` element has the same `"WebRTC Sample"` text on it.

With this we are ready to run our first test.

### Running the test

Use the below command to run the just created test:

`npm test`

After the test is executed, you should see an output like this:

```
Spec started
Started

  WebRTC Sample
    ✓ should show title
.
Executed 1 of 1 spec SUCCESS in 0.354 sec.



1 spec, 0 failures
Finished in 0.353 seconds
[16:59:05] I/local - Shutting down selenium standalone server.
[16:59:05] I/launcher - 0 instance(s) of WebDriver still running
[16:59:05] I/launcher - chrome #01 passed
```

And that's it, we have the first test running and passing.

Now, let's move on to the next lesson to create some new tests and to organize things better.

## Lesson 2 - New tests and page object

## Lesson 3 - Two browsers (first test)

## Lesson 4 - Two browsers (other tests)

## Lesson 5 - Separating tests

## Summary
