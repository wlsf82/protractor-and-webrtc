"use strict";

const DEFAULT_TIMEOUT = 5000;
const EC = protractor.ExpectedConditions;
const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample - one client", () => {
    const webrtcSample = new WebrtcSample();

    beforeEach(() => {
        return browser.get("");
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
});
