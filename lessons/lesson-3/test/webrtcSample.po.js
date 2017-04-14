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

    getRoomNameFromUrl() {
        return browser.getCurrentUrl().then((url) => {
            const roomNameFromUrl = url.replace(/http:\/\/localhost:[0-9]{0,4}\/#/g, "");
            return roomNameFromUrl;
        });
    }

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
}

module.exports = WebrtcSample;
