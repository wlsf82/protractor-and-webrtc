"use strict";

const WebrtcSample = require("./webrtcSample.po");

describe("WebRTC Sample", () => {
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
});
