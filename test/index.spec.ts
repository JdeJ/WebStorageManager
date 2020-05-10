import WebStorageManager from '../src';

describe("WebStorageManager is exported", () => {
    it("sayHello() returns 'Hello Jorge'", () => {
        expect(WebStorageManager.sayHello('Hello', 'Jorge')).toEqual('Hello Jorge');
    });
});