"use strict";

const DEFAULT_TIMEOUT = 5000;
const EC = protractor.ExpectedConditions;
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
});
