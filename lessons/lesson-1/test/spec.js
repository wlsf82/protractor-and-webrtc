"use strict";

describe("WebRTC Sample", () => {
    it("should show title", () => {
        return browser.get("http://localhost:8080");

        expect(browser.getTitle()).toEqual("WebRTC Sample");
        expect(element(by.css("h1")).getText()).toEqual("WebRTC Sample");
    });
});
