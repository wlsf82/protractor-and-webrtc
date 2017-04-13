"use strict";

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
    },
    "jasmineNodeOpts": {
        "defaultTimeoutInterval": 10000
    }
};
