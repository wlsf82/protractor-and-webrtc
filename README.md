# Protractor and WebRTC

This project is a code lab to teach the basics for creating end-to-end tests with [Protractor](http://www.protractortest.org/#/) for [WebRTC](http://webrtc.org/) applications.

Protractor is an end-to-end test framework for AngularJS applications, but it can be used for non-AngularJS apps as well, as will be shown in this code lab.

With Protractor, tests are executed against web applications running in real browsers, interacting with it as users would.

WebRTC stands from Web Real Time Communication. It is an open source project to enable realtime communication of audio, video and data in native and web apps, and it is very important to test such applications in an end-to-end way.

Creating end-to-end tests for real time communication apps is not exactly the same as it is for other kind of apps, where all the tests can run in a single instance of browser.

When talking about WebRTC apps, we need to keep in mind that the core of such application is communication, and this means that clients in two or more browsers will be interacting with each other using the app, so, automated tests needs to ensure that the correct behavior is happening for real use cases.

## Code lab structure

Each lesson in this code lab is already solved in its specific directory, but we will create it from scratch in the project's root directory, and you can check the final solution for each lesson in case of doubts.

Note: You can find all lessons inside this [directory](https://github.com/wlsf82/protractor-and-webrtc/tree/master/lessons).

In this code lab you will be able to:

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

- Basic knowledge of JavaScritp
- Computer with camera (app requirement)
- Node.js v6.x+ (use the following URL to download Node.js in case you don't have it yet: https://nodejs.org/)
- Chrome browser (due to WebRTC compatibility)

## Feedback and contributions

After completing the code lab, feel free to send me feedback about it (my email is available in the [`package.json`](https://github.com/wlsf82/protractor-and-webrtc/blob/master/package.json) file).

If you want to contribute, fork the project and submit your pull requests. I'll be happy to review and approve them in case they are good contributions.

Some suggestion of contributions are:

- Translation to other languages
- Tests where the second browser interacts with the first browser

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

As a last step for the protractor installation, update the just shown code (above) to look like this:

```
"devDependencies": {
  "jasmine-spec-reporter": "^3.2.0",
  "protractor": "5.0.0"
}
```

By removing the `^` symbol from protractor's version we ensure that if the `node_modules` directory is removed and `npm i` is executed again, the correct version of protractor will be installed.

Now with protractor correctly installed we can start configuring it.

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

## Lesson 2 - Page Object and new tests

In this lesson you will learn:

- How to create Page Object for helping on code maintainability and readability
  - How to expose application elements
  - How to expose Page Object methods
- How to update already existing tests to use Page Objects
- And how to create new test cases (high and low level) using Page Objects

### Page Objects brief introduction

Before creating the new tests we will create a Page Object file to store some specific elements from the main page of the application under test.

Page Objects help on writing cleaner tests by encapsulating information about the elements on the application page. A Page Object can be reused across multiple tests, and if the template of your application changes, you only need to update the Page Object.

Page objects are also helpful for encapsulating methods that may be used in the tests, mainly when more than one step is necessary, which helps on avoiding code duplication.

### Page Object creation

Inside the `test` directory, create a file called `webrtcSample.po.js`.

The `.po` extension means that this is a Page Object file. This is just a convention that helps on identifying different kind of files, such as test files (`*.spec.js`), configuration files (`protractor.conf.js`) and Page Object files (`webrtcSample.po.js`).

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

Then we are defining a `WebrtcSample` class and this class has a constructor that exposes publicly (using `this`) different web elements from the application under test.

Some of the elements are defined using css selectors:

> `this.title = element(by.css("h1"));`
> `this.incomingPhotosTitle = element(by.css("h2"));`

And others are identified by their ids:

> `this.videoCanvas = element(by.id("videoCanvas"));`
> `this.snapButton = element(by.id("snap"));`
> `this.sendButton = element(by.id("send"));`
> `this.snapAndSendButton = element(by.id("snapAndSend"));`

And finally we are exporting the `WebrtcSample` class as a module.

With the Page Object create, before creating new tests we can update the already existing one to use it.

### Update test to use Page Object

Change the code of the already existing test to look like this (the code will be explained):

```
"use strict";

const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample - one client", () => {
    const webrtcSample = new WebrtcSample();

    it("should show title", () => {
        browser.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(webrtcSample.title.getText()).toEqual("WebRTC Sample");
    });
});
```

Note that right after the `"use strict;"` statement we are requiring the just create Page Object and storing it in a variable called `WebrtcSample`.

Note that we are also creating a object, based on the `WebrtcSample` class, and we're storing it in a variable called `webrtcSample`

Note: We use upper camel case for the class name and lower camel case for the object name.

Finally, note that in the second expectation, instead of defining the element directly in the test, we are now using the just instantiated object, and getting the text of the `title` element of this Page Object for comparing to our expectation (`.toEqual("WebRTC Sample");`).

> Using Page Objects not only helps on maintainability, but also on readability.

Now it is time to create some new tests.

### Create new tests using the just create Page Object

Let's create some new tests to check that the main elements of the application are displayed when accessing it and to verify some expected behaviors when simulating a real use case.

Update the `spec.js` file with the following new code:

```
"use strict";

const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample - one client", () => {
    const webrtcSample = new WebrtcSample();

    beforeEach(() => {
        browser.get("http://localhost:8080");
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

Note that a `beforeEach` function was created and that the code for the test to access the URL of the application was moved to this function.

This is useful for not duplicating the call of this code in all tests, because this way we ensure that each test is independent of each other, and also to ensure that each test is with the application in a "clean" state.

Note also that beyond the already existing test, we now have two more tests.

One of the new tests verify that some main elements of the application are displayed, and the other one checks that the correct text is displayed for a specific element.

### Create some low level test cases

Some times, when creating tests for WebRTC applications we may need to check some informations that may not be available to the final users, but that may be available to the browser where the application is running.

Some examples of these verifications can be:

- Verifying that stream is active
- Verifying that video autoplay is enabled
- Verifying signaling connection
- Verifying video tracking
- Etc

This kind of verifications will be the focus of the new tests that we will create.

Update the `spec.js` file with the following new tests:

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

    expect(roomNameFromUrl).toEqual(oomNameFromConsole);
});
```
The first new test store in a variable called `isStreamActive` the return of a pure JavaScript code and then it expects that the value stored in this variable is equal to true, meaning that stream is active.

The second new test store in a variable called `isVideoAutoplayEnabled` the return of a pure JavaScript code and then it expects that the value stored in this variable is equal to true, meaning that video autoplay is enabled.

This is a powerful option of Protractor and it may be very useful when testing WebRTC applications, since you can check that many things that happen in the background are working fine when when simulating the real use of the application.

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

Now you can revisit the third new test and note that:

- It stores in a variable called `roomNameFromUrl` the room name returned by the just created method in the Page Object.
- It also stores in a variable called `roomNameFromConsole` the value of room name, but now from the console. Think of this as a information that is in the background, not visually available for the final user.
- And it expects that both room names (from the URL and from the console) are the same.

### Run the new tests

Use the below command to run all the tests:

`npm test`

An output like this should be displayed in the console:

```
Spec started
Started

  WebRTC Sample - one client
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

### Bonus

As an extra best practice for this lesson, let's do one small but very useful refactoring.

Update the `protractor.conf.js` file adding the following new configuration, right below the `"specs"` definition:

`"baseUrl": "http://localhost:8080",`

Then update the `spec.js` file by changing the code inside the `beforeEach` function to look like this:

`browser.get("");`

Since now the base URL of the application is defined in the protractor configuration file, the step that visits the web page can use the relative path, instead of the absolute one, and once we are visiting the home page and the app creates the room name automatically for us, we can just pass an empty string.

> **Suggestion:** Change the code in the `beforeEach` function passing a room name as a string (e.g.: `browser.get("#my-room");`), run the tests and see the tests visiting the room you specified instead of the random generated room.

> Note: If you specify the room name, it needs to start with the `#` symbol.

Now that we have a good test suite for the basic things of our sample application it is time to create some test cases for real use cases. Let's move on to the next lesson.

## Lesson 3 - Two browsers

In this lesson you will learn:

- How to create tests where two browsers interact with each other
- How to create other Page Object methods that may be useful for tests with two or more browsers

### Brief introduction to real use cases of WebRTC applications

You may have noticed that so far all the tests are only navigating to the application under test and performing verifications. There is no other interaction and the application is not being used as real users would do.

For simulating real usage of the application we will need to create tests where two browsers will navigate to the same room and will interact with each other.

With this WebRTC Sample application it is possible to take snaps and send to the other client in the same room, and this is what we are going to do.

### Defining the test cases

The idea is create test cases to the following scenarios:

- Check that incoming photo is displayed on browser 2 when browser 1 clicks 'snap & send'
- Check that two incoming photos are displayed on browser 2 when browser 1 clicks 'snap & send' twice
- Check that incoming photo is displayed on browser 2 when browser 1 clicks 'snap' and 'send'
- Check that incoming photo is not displayed on browser 2 when browser 1 clicks 'snap & send' but browser 2 refreshes the page after receiving the photos
- Check that an alert is shown when two clients are in the same room and a third one tries to join

Note: For all the above mentioned test cases both clients/browsers will be in the same room

### Create new tests with more interaction

First of all, update the `spec.js` file with the below code, right below the `"use strict"` statement, and before requiring the Page Object:

```
const DEFAULT_TIMEOUT = 5000;
const EC = protractor.ExpectedConditions;
```

In the above code we are basically defining a constant called `DEFAULT_TIMEOUT` with the value of `5000` milliseconds, because we will use this exact same value for some of the new test cases.

We are also storing in a variable called `EC` the `protractor.ExpectedConditions`, that are used together with `browser.wait` and with the timeout, to wait for elements being in a specific state, for example, before interacting or performing verifications with them.

Then, update the same file with the below new test cases (they will all be explained in details later):

```
it("should show incoming photo on browser 2 when browser 1 clicks 'snap & send' and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click();
    browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);

    expect(incomingPhotoOnBrowser2.isDisplayed()).toBe(true);

    browser2.quit();
});

it("should show two incoming photos on browser 2 when browser 1 clicks 'snap & send' twice and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotosOnBrowser2 = webrtcSample.getIncomingPhotosOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click();
    webrtcSample.snapAndSendButton.click();
    browser2.wait(EC.visibilityOf(incomingPhotosOnBrowser2.last()), DEFAULT_TIMEOUT);

    expect(incomingPhotosOnBrowser2.count()).toBe(2);

    browser2.quit();
});

it("should show incoming photo on browser 2 when browser 1 clicks 'snap' and 'send' and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapButton.click();
    webrtcSample.sendButton.click();
    browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);

    expect(incomingPhotoOnBrowser2.isDisplayed()).toBe(true);

    browser2.quit();
});

it("should not show incoming photo on browser 2 when browser 1 clicks 'snap & send', but after that, browser 2 refreshes the page, and they are in the same room", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);
    const incomingPhotoOnBrowser2 = webrtcSample.getFirstIncomingPhotoOnBrowser2(browser2);

    browser2.ignoreSynchronization = true;
    webrtcSample.snapAndSendButton.click();
    browser2.wait(EC.visibilityOf(incomingPhotoOnBrowser2), DEFAULT_TIMEOUT);
    browser2.refresh();

    expect(incomingPhotoOnBrowser2.isPresent()).not.toBe(true);

    browser2.quit();
});

it("should show an alert meaning that the room is full when a third client tries to join", () => {
    const browser2 = webrtcSample.openNewBrowserInTheSameRoom(browser);

    browser2.ignoreSynchronization = true;

    const browser3 = webrtcSample.openNewBrowserInTheSameRoom(browser);

    browser3.ignoreSynchronization = true;
    // There is no expectation in this test, but the below step will fail if no alert is displayed.
    browser3.switchTo().alert().accept();
    browser2.quit();
    browser3.quit();
});
```

Finally, update the `webrtcSample.po.js` file adding the following new methods (they will all be explained as well):

```
openNewBrowserInTheSameRoom(browser) {
    return browser.forkNewDriverInstance(true);
}

getFirstIncomingPhotoOnBrowser2(browser2) {
    const element2 = browser2.element;

    return element2(by.css("#trail canvas"));
}

getIncomingPhotosOnBrowser2(browser2) {
    const element2 = browser2.element;

    return element2.all(by.css("#trail canvas"));
}
```

These new methods are used to (in this order):

- Start a new browser in the exact same room where the first browser is (note that a `browser` argument is needed, since this is used in the `forkNewDriverInstance(true)`. The `true` argument means that the new browser instance will be in the same URL of the browser base)
- Return the first incoming photo on `browser2` (note that a `browser2` argument is needed and that an `element2` element is stored in the variable, for being used to locate elements in the second browser)
- Return all the incoming photos from `browser2` (the same logic of the previous method is applied here)

Now let's understand the new test cases.

I'll explain the fourth first new test cases together, since they are very similar.

All the just mentioned test cases have the following in common:

- They store in a variable called `browser2` the new opened browser
- They store the `incomingPhotoOnBrowser2` or the `incomingPhotosOnBrowser2` for further verification
- They set `browser2.ignoreSynchronization` equal to `true`, since protractor needs to know that the application is the second browser is also a non-AngularJS app
- They perform on or more clicks in the `snapAndSendButton`, `snapButton` and `sendButton`
- They wait for a maximum of 5000 milliseconds for the `incomingPhotoOnBrowser2` or `incomingPhotosOnBrowser2` be visible
- Specifically for the fourth new test case the browser is refreshed
- They run their specific verifications, such as verifying that the `incomingPhotoOnBrowser2` is displayed when after the first browser clicks `snap & send` or `snap` and `send`; verifying that the count of `incomingPhotosOnBrowser2` is equal to `2` when `snap & send` is clicked twice; verifying that now incoming photo is displayed on `browser2` after the first browser clicks `snap & send`, but the second browser refreshes the page
- And lastly, `browser2` is closed, using the `quit()` function, since protractor only knows that it has to automatically closes the first browser.

And the last new test cases basically:

- Opens a new browser in the same room of the first browser
- Calls `browser2.ignoreSynchronization = true` (non-AngularJS app)
- Does the same two steps for a third browser
- Swiths to an expected alert and clicks ok (accpet it)
- And both two new browsers (`browser2` and `browser3` are closed using the `quit()` function)

Note that for the last new test case there is no verification, but if the alert is not displayed, the test will fail, so this is ok.

Now, let's run our updated test suite.

### Running the complete test suite

Now that we have a test suite with test cases for all the main elements in the page and also for real use cases of the app, it's time to see them running.

Use the below command to run the tests:

`npm test`

If everything went ok, you should see a result like this:

```
Spec started
Started

  WebRTC Sample - one client
    ✓ should show title
.    ✓ should show video element and buttons for 'snap', 'send' and 'send and snap'
.    ✓ should show header for incoming photos
.    ✓ should stream be active
.    ✓ should autoplay video be enabled
.    ✓ should have the same room name on url and when returning it on console
.    ✓ should show incoming photo on browser 2 when browser 1 clicks 'snap & send' and they are in the same room
.    ✓ should show two incoming photos on browser 2 when browser 1 clicks 'snap & send' twice and they are in the same room
.    ✓ should show incoming photo on browser 2 when browser 1 clicks 'snap' and 'send' and they are in the same room
.    ✓ should not show incoming photo on browser 2 when browser 1 clicks 'snap & send', but after that, browser 2 refreshes the page, and they are in the same room
.    ✓ should show an alert meaning that the room is full when a third client tries to join
.
Executed 11 of 11 specs SUCCESS in 7 secs.



11 specs, 0 failures
Finished in 7.23 seconds
[18:07:48] I/local - Shutting down selenium standalone server.
[18:07:48] I/launcher - 0 instance(s) of WebDriver still running
[18:07:48] I/launcher - chrome #01 passed
```

Yay! 11 test cases running in 7 seconds and we are covering the most important scenarios of the application.

## Summary and other resources

**Congratulations!** You now know to how create end-to-end test with Protractor for WebRTC applications.

In this code lab you learned:

- How to configure protractor for running end-to-end tests on WebRTC applications
- How to create basic end-to-end automated tests (high and low level)
- How to use Page Objets for better organizing tests
- How to create automated tests where two browsers interact with each other

### List of resources for keep learning

This code lab is just a bit of what you can do for testing WebRTC and other kind of web applications with Protractor.

To keep learning about this subject, I'd like to share with you some other content resources that may be useful:

[End to end testing with Protractor](https://leanpub.com/end-to-end-testing-with-protractor) book

[Protractor](https://www.casadocodigo.com.br/products/livro-protractor) book - Portuguese version of the above book

[Talking About Testing blog](https://talkingabouttesting.com/category/protractor-2/) - content is Portuguese (use [Google Translator!](https://translate.google.com))

[Learning Protractor](https://www.youtube.com/playlist?list=PL-eblSNRj0QEvVfKp0Xzagao9SqaSyW5k) - hands on videos on Youtube with Portuguese content about Protractor in general
___

Keep learning, keep testing!
