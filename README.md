# Protractor and WebRTC

This project is a code lab to teach the basics for creating end-to-end tests with [Protractor](http://www.protractortest.org/#/) for [WebRTC](http://webrtc.org/) applications.

Protractor is an end-to-end test framework for AngularJS applications, but it can be used for non-AngularJS apps as well, as will be shown in this code lab.

With Protractor, tests are executed against web applications running in real browsers, interacting with it as users would.

WebRTC stands from Web Real Time Communication. It is an open source project to enable rea ltime communication of audio, video and data in native and web apps, and it is very important to test such applications in an end-to-end way, to ensure that it works to the end users.

Creating end-to-end tests for real time communication apps is not exactly the same as it is for other kind of applications, where all the tests can run in a single instance of browser.

When talking about WebRTC apps, we need to keep in mind that the core of such application is communication, and this means that clients in two or more browsers will be interacting with each other using the app, so, automated tests needs to ensure that the correct behavior is happening for real use cases.

## Motivation

I work with software testing automation using the Protractor framework for almost 3 years, and now that I'm using this framework professionally for testing WebRTC applications, I thought would be nice to share some learnings with the software community.

This project was created during Easter holidays and I hope it will be useful for software engineers developing WebRTC applications.

## Code lab structure

Each lesson in this code lab is already solved in its specific directory, but we will create it from scratch in the project's root directory, and you can check the final solution for each lesson in case of doubts.

Note: You can find all lessons inside this [directory](https://github.com/wlsf82/protractor-and-webrtc/tree/master/lessons).

After completing this code lab you will be able to:

- [Setup the application under test (AUT)](https://github.com/wlsf82/protractor-and-webrtc#lesson-0---setup)
- [Create the first end-to-end test for the AUT](https://github.com/wlsf82/protractor-and-webrtc#lesson-1---first-test)
- [Create more tests and organize them using best practices](https://github.com/wlsf82/protractor-and-webrtc#lesson-2---page-object-and-new-tests)
- [Create tests that simulate real usage of WebRTC apps](https://github.com/wlsf82/protractor-and-webrtc#lesson-3---two-browsers)
- [Find useful resources to keep learning about end-to-end tests for web applications](https://github.com/wlsf82/protractor-and-webrtc#summary-and-other-resources)

## Sample application

We will use a sample WebRTC application based on the following Google's code lab for all lessons: https://codelabs.developers.google.com/codelabs/webrtc-web/#8.

The sample app basically allows two clients to connect in the same room and send snaps to each other.

Note: there is no need to clone the app from the Google's code lab, since this is already part of this project, with minor modifications.

![WebRTC Sample app during end-to-end test execution](https://s3-sa-east-1.amazonaws.com/helloworld-wlsf82/webrtc-sample.png)

## Pre-requirements

- Knowledge of JavaScritp
- Basic knowledge of CSS selectors
- Node.js v6.x+ (use the following URL to download Node.js in case you don't have it yet: https://nodejs.org/)
- Chrome, Firefox or Opera browser(due to WebRTC compatibility)

## Feedback and contributions

When you are done with this code lab feel free to send me feedback (my email is available in the [`package.json`](https://github.com/wlsf82/protractor-and-webrtc/blob/master/package.json) file).

If you want to contribute, fork the project and submit your pull requests. I'll be happy to review them.

Some suggestions of contributions are:

- Translation to other languages
- Fix potential issues in the sample app
- Make it work with Firefox and Opera browsers
- Add test for checking ICE connection state
- Fix typos and grammar issues

## Lesson 0 - Setup

In this lesson you will learn:

- How to install the application dependencies
- How to start the app
- How to install Protractor and a test report as dev dependencies
- How to create a basic Protractor configuration for running end-to-end tests
- And how to create and run a npm test script

### Installing the app dependencies

After cloning the project, from the root directory where it was downloaded, run the below command to install the application dependencies:

`npm i`

This command will basically install the project dependencies defined in the `package.json` file.

With all the dependencies installed you can already start the app to test it out.

### Starting the app

This WebRTC sample application is based on Node.js, this means that node will be used to start it.

In the `package.json` file there is a npm script that runs `node index.js`. To start the app we will use this script.

From the project's root directory, run the below command:

`npm start`

With the app running, open the Chrome browser and type the following URL and press ENTER: http://localhost:8080

If everything went ok, you should see the WebRTC Sample app running.

Note: This app requires camera access, so, in the first time you access it, you may allow the browser to access your computer's camera.

After allowing the browser to access the camera, you should see yourself in the app.

Note: don't worry if your computer doesn't have a camera, we will a fake camera device for the automated tests.

Now that everything is working it's time to install Protractor, so that you can create automated end-to-end tests.

### Protractor and test report installation

Protractor is also Node.js based, so we will use npm (node package manager) to install it.

From the project's root directory (in another console's tab), run the bellow command:

`npm i protractor@5.0.0 jasmine-spec-reporter -D`

Note: It is necessary to define the version 5.0.0 of Protractor due to an issue with version 5.1.x related to the usage of `forkNewDriverInstance()` and `browser.ignoreSynchronization`. This specific things will be explained later during the code lab.

At the same time, we are installing a node module called `jasmine-spec-reporter`, that will be used for better test reporting.

The `-D` argument will install Protractor and jasmine-spec-reporter as a dev dependencies.

After the Protractor's successful installation, the following code should be displayed in the `package.json` file (the `jasmine-spec-reporter` version may be newer):

```
"devDependencies": {
  "jasmine-spec-reporter": "^3.2.0",
  "protractor": "^5.0.0"
}
```

As a last step for the Protractor installation, update the just shown code (above) to look like this:

```
"devDependencies": {
  "jasmine-spec-reporter": "^3.2.0",
  "protractor": "5.0.0"
}
```

By removing the `^` symbol from Protractor's version we ensure that if the `node_modules` directory is removed and `npm i` is executed again, the correct version of Protractor will be installed.

Now that we have Protractor correctly installed it is time to configure it.

### Protractor configuration setup

The first thing needed to start using Protractor is to setup some basic configurations.

Follow the below instructions:

In the project's root directory, create a `test` directory, and inside this new directory create a file named as `protractor.conf.js`.

After creating the file, add the following code snippet to it (each part will be explained):

```
"use strict";

const SpecReporter = require("jasmine-spec-reporter").SpecReporter;

module.exports.config = {
    "specs": ["*.spec.js"],
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

Secondly we are requiring the `jasmine-spec-reporter` module and we are storing it in a variable named `SpecReporter`. This will be used for a better test report in the console when running the tests.

Then we are exporting a config module, where all configurations needed for Protractor to run will be defined.

Each configuration will be explained below:

#### specs

This attribute has an array as its value. The values defined inside this array will be the name of the test files, and they need to be quoted and comma separated.

Note: Since we are defining only one value for the array, there is no need for comma.

#### capabilities

This is the attribute that defines the browser where the tests will be executed against.
For the capabilities config we are also defining some arguments for the `chromeOptions`, to automatically allow the browser's camera usage and to fake media stream (this is specifically related to WebRTC testing).

#### onPrepare()

This is an important configuration.

Protractor is and end-to-end test framework for AngularJS applications (as already mentioned), so, to use it for non-AngularJS apps it is necessary to define the configuration `browser.ignoreSynchronization = true;`. This configuration tells Protractor to not look for Angular when starting running the tests, and it is defined in the `onPrepare` function since this is a callback function called once Protractor is ready and available, and before the specs are executed.

In the `onPrepare` function we are also defining some specific `jasmine-spec-reporter` configurations for better test reporting.

#### jasmineNodeOpts

By default, Protractor uses [Jasmine](https://jasmine.github.io) as a base framework.
In the `jasmineNodeOpts` configuration we are setting the `"defaultTimeoutInterval"` to `5000` milliseconds. We are basically overwriting the default configuration that is `30000` milliseconds, once the tests that we will write are meant to be very fast, and in case of timing issues, we don't want to make a test case wait 30 seconds before failing.

### NPM test script

To ease running the tests we will use a npm script, as we have for starting the app.

From the project's root directory, update the `package.json` file with the following code, right below the `"start"` script:

`"test": "./node_modules/.bin/webdriver-manager update && ./node_modules/.bin/protractor test/protractor.conf.js"`

Note: remember to separate the scripts using comma.

In the end you will have a `"scripts"` section like this:

```
"scripts": {
  "start": "node index.js",
  "test": "./node_modules/.bin/webdriver-manager update && ./node_modules/.bin/protractor test/protractor.conf.js"
},
```

Protractor needs `webdriver-manager` to be updated before running the tests, so, in the npm script we are defining two commands that will be executed one after the other. The first command updates the webdriver, and the second command runs the Protractor configuration file.

Note that we are calling webdriver and protractor from the `node_modules` directory, since they were installed as dev dependencies.

After updating and saving the `package.json` file, from the project's root directory, run the below command:

`npm test`

If everything went ok you should see an output like this:

```
> webrtc-sample@0.0.1 test /Users/foobarbazuser/protractor-and-webrtc
> webdriver-manager update && ./node_modules/.bin/protractor test/protractor.conf.js

[14:37:41] I/update - chromedriver: file exists /Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.26mac64.zip
[14:37:41] I/update - chromedriver: unzipping chromedriver_2.26mac64.zip
[14:37:41] I/update - chromedriver: setting permissions to 0755 for /Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.26
[14:37:41] I/update - chromedriver: 2.26 up to date
[14:37:41] I/update - selenium standalone: file exists /Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar
[14:37:41] I/update - selenium standalone: 2.53.1 up to date
[14:37:41] I/update - geckodriver: file exists /Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.12.0-macos.tar.gz
[14:37:41] I/update - geckodriver: unzipping geckodriver-v0.12.0-macos.tar.gz
[14:37:41] I/update - geckodriver: setting permissions to 0755 for /Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.12.0
[14:37:41] I/update - geckodriver: v0.12.0 up to date
[14:37:42] W/configParser - pattern *.spec.js did not match any files.
[14:37:42] E/launcher - Spec patterns did not match any files.
[14:37:42] E/launcher - Error: Spec patterns did not match any files.
    at Runner.run (/Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/built/runner.js:234:19)
    at TaskRunner.run (/Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/built/taskRunner.js:109:27)
    at createNextTaskRunner (/Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/built/launcher.js:234:28)
    at helper.runFilenameOrFn_.then.then.then (/Users/foobarbazuser/protractor-and-webrtc/node_modules/protractor/built/launcher.js:259:13)
    at _fulfilled (/Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:834:54)
    at self.promiseDispatch.done (/Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:863:30)
    at Promise.promise.promiseDispatch (/Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:796:13)
    at /Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:604:44
    at runSingle (/Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:137:13)
    at flush (/Users/foobarbazuser/protractor-and-webrtc/node_modules/q/q.js:125:13)
[14:37:42] E/launcher - Process exited with error code 199
npm ERR! Test failed.  See above for more details.
```

This error is expected, since there is no test file (`*.spec.js`) created yet.

With this we finish lesson 0. Move on to lesson 1 to create the first test.

## Lesson 1 - First test

Now that we have an app up and running and the basic configurations needed for Protractor, it is time to create the first test.

In this lesson you will learn:

- How to create a simple end-to-end test
- And how to run the first test

### Test creation

For the first test will not focus on WebRTC specific stuff, but in the Protractor basics. Later, with some knowledge about how to create tests with Protractor we will evolve to specific test for WebRTC applications.

In the already created test directory, create a file named as `webrtcSample.spec.js`. This is the file that will store our test suite.

Add the following code snippet to the just created file (every part of the code willl be explained):

```
"use strict";

describe("WebRTC Sample", () => {
    it("should show title", () => {
        return browser.driver.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(element(by.css("h1")).getText()).toEqual("WebRTC Sample");
    });
});
```

Again, in the beginning we are using `"use strict";` due to ECMAScript 2015 syntax.

Then we are defining a `describe` statement, that receives two arguments, the first one is a string that will name the test suite (in this case `"WebRTC Sample"`), and the second argument is a callback function, that we run all our test cases.

Inside the just mentioned callback function we define an `it` statement. This statement also receives a string as the first argument and a callback function as the second argument. The first argument will basically name our first test case, and the second one will run all the steps of our test case.

Finally, we define the steps for the test to run.

The `return browser.driver.get("http://localhost:8080");` code will access the defined URL in the Chrome browser that will be automatically opened by the Protractor configuration file.

Note: here we use the webdriver implementation directly instead of the simple `browser.get` of Protractor, since this is recommended when testing non-AngularJS applications.

Then we have two expectations, one to check that the title of the page is equal to `"WebRTC Sample"` and another to check that a `h1` element has the same `"WebRTC Sample"` text on it.

With this we are ready to run our first test.

### Running the test

Use the below command to run the just created test:

`npm test`

After the test is executed you should see an output like this:

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

That's it for lesson 1. We have the first test running and passing.

Now let's move on to the next lesson to create some new tests and to organize things better.

## Lesson 2 - Page Objects and new tests

In this lesson you will learn:

- How to create a Page Object for helping on code maintainability and readability
  - How to expose application elements
  - How to expose Page Object methods
- How to update the already existing test to use the Page Object
- And how to create new test cases (high and low level) using the Page Object

### Page Objects brief introduction

Before creating new tests we will create a Page Object file to store some specific elements from the main page of the application under test (later we will add some methods to it as well).

Page Objects help on writing cleaner tests by encapsulating information about the elements on the application page. A Page Object can be reused across multiple tests, and if the template of the application changes, you only need to update the Page Object.

Page objects are also helpful for encapsulating methods that may be used by the tests, mainly when more than one step is necessary, which helps on avoiding code duplication.

### Page Object creation

Inside the `test` directory, create a file named as `webrtcSample.po.js`.

The `.po` extension means that this is a Page Object file. This is a convention that helps on identifying different kind of files, such as test files (`*.spec.js`), configuration files (`*.conf.js`) and Page Object files (`*.po.js`).

Add the following code snipped to the just created `.po` file (all the code will be explained):

```
"use strict";

class WebrtcSample {
    constructor() {
        this.title = element(by.css("h1"));
        this.videoCanvas = element(by.id("videoCanvas"));
        this.snapButton = element(by.id("snap"));
        this.sendButton = element(by.id("send"));
        this.snapAndSendButton = element(by.id("snapAndSend"));
        this.incomingPhotosTitle = element(by.css("h2"));
    }
}

module.exports = WebrtcSample;
```

Again, we are using `"use strict;"` due to ECMAScript 2015 syntax.

We are defining a `WebrtcSample` class and this class has a constructor that exposes publicly (using `this`) different web elements from the application under test.

Some of the elements are defined using css selectors:

> `this.title = element(by.css("h1"));`

> `this.incomingPhotosTitle = element(by.css("h2"));`

And others are identified by their ids:

> `this.videoCanvas = element(by.id("videoCanvas"));`

> `this.snapButton = element(by.id("snap"));`

> `this.sendButton = element(by.id("send"));`

> `this.snapAndSendButton = element(by.id("snapAndSend"));`

This are basically web elements that are part of the WebRTC Sample application.

Finally we are exporting the `WebrtcSample` class as a module.

With the Page Object created, before creating new tests we can update the already existing one to use it.

### Updating test to use Page Object

Change the code of the already existing test to look like this (the code will be explained):

```
"use strict";

const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample", () => {
    const webrtcSample = new WebrtcSample();

    it("should show title", () => {
        return browser.driver.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(webrtcSample.title.getText()).toEqual("WebRTC Sample");
    });
});
```

Note that right after the `"use strict;"` statement we are requiring the just created Page Object and storing it in a variable named as `WebrtcSample`.

Note that we are also creating an object based on the `WebrtcSample` class and we are storing it in a variable named as `webrtcSample`

Note: We use upper camel case for the class name and lower camel case for the object name.

Finally, note that in the second expectation, instead of defining the element directly in the test, we are now using the just instantiated object and getting the text of the `title` element of this Page Object for comparing to our expectation (`expect(webrtcSample.title.getText()).toEqual("WebRTC Sample");`).

> Using Page Objects not only helps on maintainability, but also on readability.

If you want, run the `npm test` command again to see that your test is still working.

Now it is time to create some new tests.

### Creating new tests using the just created Page Object

Let's create some new tests to check that the main elements of the application are displayed when accessing it and to verify some things that run in the background of the app.

Update the `webrtcSample.spec.js` file with the following new code:

```
"use strict";

const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample", () => {
    const webrtcSample = new WebrtcSample();

    beforeEach(() => {
        return browser.driver.get("http://localhost:8080");
    });

    it("should show title", () => {
        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(webrtcSample.title.getText()).toEqual("WebRTC Sample");
    });

    it("should show video element and buttons for 'snap', 'send' and 'send and snap'", () => {
        expect(webrtcSample.videoCanvas.isDisplayed()).toBe(true);
        expect(webrtcSample.snapButton.isDisplayed()).toBe(true);
        expect(webrtcSample.sendButton.isDisplayed()).toBe(true);
        expect(webrtcSample.snapAndSendButton.isDisplayed()).toBe(true);
    });

    it("should show header for incoming photos", () => {
        expect(webrtcSample.incomingPhotosTitle.getText()).toEqual("Incoming photos");
    });
});
```

Note that a `beforeEach` function was created and that the code for the test to access the URL of the application under test was moved to the callback of this function.

This is useful for not duplicating the call of the `browser.driver.get()` statement in all tests. This way we ensure that each test is independent of each other, and also, to ensure that each test is with the application in a "clean" state.

Note also that beyond the already existing test, we now have two more tests.

One of the new tests verify that some main elements of the application are displayed, and the other one checks that the correct text is displayed for a specific element.

### Creating some low level test cases

Some times, when creating tests for WebRTC applications we may need to check some informations that may not be directly available to the final users, but that may be available to the browser where the application is running.

Some examples of these verifications are:

- Verifying that stream is active
- Verifying that video autoplay is enabled
- Verifying signaling connection
- Verifying video tracking

This kind of verifications will be the focus of the new tests that we will create.

Update the `webrtcSample.spec.js` file with the following new tests:

```
it("should stream be active", () => {
    const isStreamActive = browser.executeScript("return window.stream.active;");

    expect(isStreamActive).toBe(true);
});

it("should autoplay video be enabled", () => {
    const isVideoAutoplayEnabled = browser.executeScript("const video = document.getElementById('camera'); return video.autoplay;");

    expect(isVideoAutoplayEnabled).toBe(true);
});

it("should have the same room name on url and when returning it on console", () => {
    const roomNameFromUrl = webrtcSample.getRoomNameFromUrl();
    const roomNameFromConsole = browser.executeScript("return room;");

    expect(roomNameFromUrl).toEqual(roomNameFromConsole);
});
```
The first new test stores in a variable named as `isStreamActive` the return of the `browser.executeScript` promise. This `browser.executeScript` receives as argument a pure JavaScript code that returns `window.stream.active`. Finally, it expects that the value stored in the variable is equal to `true`, meaning that stream is active.

The second new test stores in a variable named as `isVideoAutoplayEnabled` the return of the `browser.executeScript` promise as well. In this case `browser.executeScript` receives a variable for the video element and then returns the property `autoplay` of this element. Finally, it expects that the value stored in the variable is equal to `true`, meaning that video autoplay is enabled.

This `browser.executeScript()` function is a powerful option of Protractor and it may be very useful when testing WebRTC applications, since you can check that many things that happen in the background are working fine when simulating the real use of the application.

Now let's update the Page Object file before the explanation of the third new test.

Add the following method to the `WebrtcSample` class, right below the `constructor` definition:

```
getRoomNameFromUrl() {
    return browser.getCurrentUrl().then((url) => {
        const roomNameFromUrl = url.replace(/http:\/\/localhost:[0-9]{0,4}\/#/g, "");
        return roomNameFromUrl;
    });
}
```

This method will basically return the room name generated when visiting the home page of the WebRTC Sample application, directly from the URL.

The `browser.getCurrentUrl()` statement returns a promise, so the `.then` function is called with its callback (that receives `url` as argument), then a variable named as `roomNameFromUrl` uses the `replace` JavaScript method to store in the variable only the room name, removing the rest of the URL using a regular expression.

Now you can revisit the third new test and note that:

- It stores in a variable named as `roomNameFromUrl` the room name returned by the just created method in the Page Object.
- It also stores in a variable named as `roomNameFromConsole` the value of room name, but now from the console, using `browser.executeScript("return room;");`. Think of this as an information that is in the background, not visually available to the final user.
- Finally, it expects that both room names (from the URL and from the console) are the same.

### Running the new tests

Use the below command to run all the tests:

`npm test`

An output like this should be displayed in the console:

```
Spec started
Started

  WebRTC Sample
    ✓ should show title
.    ✓ should show video element and buttons for 'snap', 'send' and 'send and snap'
.    ✓ should show header for incoming photos
.    ✓ should stream be active
.    ✓ should autoplay video be enabled
.    ✓ should have the same room name on url and when returning it on console
.
Executed 6 of 6 specs SUCCESS in 0.86 sec.



6 specs, 0 failures
Finished in 0.86 seconds
[17:59:25] I/local - Shutting down selenium standalone server.
[17:59:25] I/launcher - 0 instance(s) of WebDriver still running
[17:59:25] I/launcher - chrome #01 passed
```

Now that we have a good test suite for the basic things of our WebRTC sample application it is time to create some test cases for real use cases. Let's move on to the next lesson.

## Lesson 3 - Two browsers

In this lesson you will learn:

- How to create tests where two browsers interact with each other
- How to create other Page Object methods that are useful for tests with two

### Brief introduction to real use cases of WebRTC application testing

You may have noticed that so far all the tests are only navigating to the application under test and performing verifications. There is no other interaction and the application is not being used as real users would do.

For simulating real usage of the application we will need to create tests where two browsers will navigate to the same room and will interact with each other.

With this WebRTC Sample application it is possible to take snaps and send to the other client in the same room. This is exactly what we are going to do.

### Defining the test cases

The idea is create test cases for the following scenarios:

- Check that video is flowing between two clients
- Check that a incoming photo is displayed on browser 2 when browser 1 clicks 'snap & send'
- Check that a incoming photo is displayed on browser 2 when browser 1 clicks 'snap' and 'send'
- Check that a incoming photo is not displayed on browser 2 when browser 1 clicks 'snap & send' but browser 2 refreshes the page after receiving the photo
- Check that two incoming photos are displayed on browser 2 when browser 1 clicks 'snap & send' twice

Note: For all the above mentioned test cases both clients/browsers will be in the same room.

### Create new tests with more interaction

First of all, update the `webrtcSample.spec.js` file with the below code, right below the `"use strict"` statement, and before requiring the Page Object:

```
const DEFAULT_TIMEOUT = 5000;
const EC = protractor.ExpectedConditions;
```

In the above code we are basically defining a constant named as `DEFAULT_TIMEOUT` with the value of `5000` milliseconds. This exact same value will be used for some of the new test cases, so it is better to have it as a constant, to avoid duplication.

We are also storing in a variable called `EC` the `protractor.ExpectedConditions`, that are used together with `browser.wait` and with the timeout, to wait for elements being in a specific state, for example, before interacting or performing verifications with them. This is mostly used when testing non-AngularJS apps.

Then, update the same file with the below new test cases (they will all be explained in details later):

```
it("should check that video is flowing between clients", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const videoOnBrowser2 = webrtcSample.getVideoElementOnBrowser2(browser2);
    const isVideoFlowingScript = "return video.readyState === 4";

    browser2.ignoreSynchronization = true;
    browser2.wait(EC.visibilityOf(videoOnBrowser2), DEFAULT_TIMEOUT);

    expect(browser.executeScript(isVideoFlowingScript)).toBe(true);
    expect(browser2.executeScript(isVideoFlowingScript)).toBe(true);

    browser2.quit();
});

it("should show incoming photo on browser 2 when browser 1 clicks 'snap & send' and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click().then(() => {
        browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);

        expect(incomingPhotoOnBrowser2.isDisplayed()).toBe(true);

        browser2.quit();
    });
});

it("should show incoming photo on browser 2 when browser 1 clicks 'snap' and 'send' and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapButton.click()
        .then(() => webrtcSample.sendButton.click())
        .then(() => {
            browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);

            expect(incomingPhotoOnBrowser2.isDisplayed()).toBe(true);

            browser2.quit();
        });
});

it("should not show incoming photo on browser 2 when browser 1 clicks 'snap & send', but after that, browser 2 refreshes the page, and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click().then(() => {
        browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);
        browser2.refresh();

        expect(incomingPhotoOnBrowser2.isPresent()).not.toBe(true);

        browser2.quit();
    });
});

it("should show two incoming photos on browser 2 when browser 1 clicks 'snap & send' twice and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotosOnBrowser2 = webrtcSample.getIncomingPhotosOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click()
        .then(() => webrtcSample.snapAndSendButton.click())
        .then(() => {
            const twoIncomingPhotos = function() {
                return incomingPhotosOnBrowser2.count().then((numberOfPhotos) => {
                    return numberOfPhotos === 2;
                });
            };
            browser2.wait(twoIncomingPhotos, DEFAULT_TIMEOUT);

            expect(incomingPhotosOnBrowser2.count()).toBe(2);

            browser2.quit();
        });
});
```

Finally, update the `webrtcSample.po.js` file adding the following new methods (they will all be explained as well):

```
openNewBrowserInTheSameRoom(browser) {
    return browser.forkNewDriverInstance(true);
}

getVideoElementOnBrowser2(browser2) {
    return browser2.element(by.id("videoCanvas"));
}

getFirstIncomingPhotoOnBrowser2(browser2) {
    return browser2.element(by.css("#trail canvas"));
}

getIncomingPhotosOnBrowser2(browser2) {
    return browser2.element.all(by.css("#trail canvas"));
}
```

These new methods are used to (in this order):

- Start a new browser in the exact same room where the first browser is (note that a `browser` argument is needed, since this is used in the `forkNewDriverInstance(true)`. The `true` argument means that the new browser instance will use the same URL of the base browser).
- Returns the video element from `browser2` (note that a `browser2` argument is needed and that `browser2.element` is used to locate the element in the second browser).
- Return the first incoming photo on `browser2` (the same logic of the previous method is applied here).
- Return all the incoming photos from `browser2` (the same logic of the previous method is applied here as well).

Now let's understand the new test cases.

The first new test case test something that is running in the background, but that is very important to automatically check:

- It opens a second browser in the same room of the first browser and stores it in a variable named as `browser2`.
- It stores in a variable named as `videoOnBrowser2` the return of the `getVideoElementOnBrowser2` method from the `webrtcSample` Page Object.
- It stores in a variable named as `isVideoFlowingScript` the return of `video.readyState === 4`. When this returns `true` means that video is flowing (WebRTC logic).
- It sets `browser2.ignoreSynchronization` equal to `true`, since Protractor needs to know that the application in the second browser is a non-AngularJS application as well.
- It waits for a maximum of `5000` milliseconds for the `videoOnBrowser2` to be visible.
- It runs the expectations that video is flowing in both browsers.
- Finally, `browser2` is closed using the `quit()` function, since Protractor only knows that it has to automatically closes the first browser.

I'll explain the next three new test cases together, since they are very similar:

- They store in a variable named as `browser2` the new opened browser.
- They store the first incoming photo from `browser2` in a variable named as `incomingPhotoOnBrowser2` for later verification.
- They set `browser2.ignoreSynchronization` equal to `true` (non-AngularJS app).
- They perform clicks in the `snapAndSendButton` or `snapButton` and `sendButton` and call the `.then` function, since each click returns a promise. (The `.then` function is called for each `click()` performed).
- Inside the callback of the last `.then` function they wait for a maximum of `5000` milliseconds (`DEFAULT_TIMEOUT`) for the `incomingPhotoOnBrowser2` to be visible.
- Specifically for the fourth new test case the `browser2` is refreshed.
- They run their specific verifications, such as expecting that the `incomingPhotoOnBrowser2` is displayed after the first browser clicks `snap & send` or `snap` and `send`; and expecting that no incoming photo is displayed on `browser2` after the first browser clicks `snap & send`, but the second browser refreshes the page.
- And they close `browser2` with the `quit()` function.

And the last new test case:

- It also stores in a variable named as `browser2` the new opened browser.
- It stores in a variable named as `incomingPhotosOnBrowser2` all the incoming photos for later verification.
- It also sets `browser2.ignoreSynchronization` equal to `true` (non-AngularJS app).
- It clicks in the `snapAndSendButton` and calls the `.then` function, since the click returns a promise, and does it again for the second click.
- It stores in a variable named as `twoIncomingPhotos` a function that returns a promise when the `count` promise is equal to `2`, for usage in the `browser2.wait` function that comes next.
- It waits for a maximum of `5000` milliseconds for the just created condition to be `true`, meaning that two incoming photos are available.
- It finally does the verification, expecting that the count of incoming photos is `2`.
- And it closes `browser2` with the `quit()` function.

Now let's run our updated test suite.

### Running the complete test suite

Now that we have a test suite with test cases for all the main elements in the page, for things that run in the background and also for real use cases of the app, it's time to see them all running together.

Use the below command to run the tests:

`npm test`

If everything went ok you should see a result like this:

```
Spec started
Started

  WebRTC Sample
    ✓ should show title
.    ✓ should show video element and buttons for 'snap', 'send' and 'send and snap'
.    ✓ should show header for incoming photos
.    ✓ should stream be active
.    ✓ should autoplay video be enabled
.    ✓ should have the same room name on url and when returning it on console
.    ✓ should check that video is flowing between clients
.    ✓ should show incoming photo on browser 2 when browser 1 clicks 'snap & send' and they are in the same room
.    ✓ should show incoming photo on browser 2 when browser 1 clicks 'snap' and 'send' and they are in the same room
.    ✓ should not show incoming photo on browser 2 when browser 1 clicks 'snap & send', but after that, browser 2 refreshes the page, and they are in the same room
.    ✓ should show two incoming photos on browser 2 when browser 1 clicks 'snap & send' twice and they are in the same room
.
Executed 11 of 11 specs SUCCESS in 6 secs.



11 specs, 0 failures
Finished in 6.376 seconds
[19:13:25] I/local - Shutting down selenium standalone server.
[19:13:25] I/launcher - 0 instance(s) of WebDriver still running
[19:13:25] I/launcher - chrome #01 passed
```

Yay! 11 test cases running and passing in 6 seconds and we are covering the most important scenarios of the application.

## Summary and other resources

**Congratulations!** You now know to how create end-to-end test with Protractor for WebRTC applications.

In this code lab you learned:

- How to configure Protractor for running end-to-end tests for WebRTC applications
- How to create basic end-to-end automated tests (high and low level)
- How to use Page Objets for better organizing tests
- How to create automated tests where two browsers interact with each other
- How to work with Protractor promises

### List of resources for keep learning

This code lab is just a bit of what you can do for testing WebRTC and other web applications with Protractor.

To keep learning about this subject here are some other content resources that may be useful:

[End to end testing with Protractor](https://leanpub.com/end-to-end-testing-with-protractor) - book

[Protractor](https://www.casadocodigo.com.br/products/livro-protractor) - book - Portuguese version of the above book

[Talking About Testing blog](https://talkingabouttesting.com/category/protractor-2/) - content is Portuguese (use Google Translator)

[Learning Protractor](https://www.youtube.com/playlist?list=PL-eblSNRj0QEvVfKp0Xzagao9SqaSyW5k) - hands on videos on Youtube with Portuguese content about Protractor in general
___

Keep learning, keep testing!
