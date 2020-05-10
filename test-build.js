const assert = require("assert");
const WebStorageManager = require("./dist");

const hello = 'Hello';
const name = 'Jorge';
const result = WebStorageManager.sayHello(hello, name);
assert.equal(result, 'Hello Jorge');

console.info("Build tested!");
