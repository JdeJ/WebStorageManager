import { WebStorage } from './types';
import { WebStorageManager } from './WebStorageManager';

describe('WebStorage space ', () => {
	test.each([
		['sessionStorage', 4864],
		['localStorage', 4864],
		['windowStorage', 4864]
	])(
		'of "%s" should be %d',
		(storage, expected) => {
			expect(
				WebStorageManager.getStoreSpace(<WebStorage>storage)
			).toEqual(expected);
		},
		5
	);
});

// test('Must clean WebStorge', () => {});

// describe('Must store and return data', () => {
// 	function cleanStore() {
// 		db.cleanUp();
// 	}

// 	afterEach(() => {
// 		cleanUpDatabase(globalDatabase);
// 	});

// 	const data = 'a'.repeat(4980736);
// 	test('Must store data', () => {});
// 	test('Must return stored data', () => {});
// 	test('Must overwrite stored data', () => {});
// 	test('Must fail on "undefined" value', () => {});
// 	test('Must fail on unstored key', () => {});
// 	test('Must fail when not enough space', () => {});
// });

/**
describe("storageQuota", () => {
    describe("not set", () => {
      it("should be 5000000 code units by default", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, { url: "https://example.com" })).window;
        const dataWithinQuota = "0".repeat(4000000);

        localStorage.setItem("foo", dataWithinQuota);
        sessionStorage.setItem("bar", dataWithinQuota);

        assert.strictEqual(localStorage.foo, dataWithinQuota);
        assert.strictEqual(sessionStorage.bar, dataWithinQuota);

        const dataExceedingQuota = "0".repeat(6000000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });

    describe("set to 10000 code units", () => {
      it("should only allow setting data within the custom quota", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, {
          url: "https://example.com",
          storageQuota: 10000
        })).window;
        const dataWithinQuota = "0".repeat(5);

        localStorage.setItem("foo", dataWithinQuota);
        sessionStorage.setItem("bar", dataWithinQuota);

        assert.strictEqual(localStorage.foo, dataWithinQuota);
        assert.strictEqual(sessionStorage.bar, dataWithinQuota);

        const dataJustWithinQuota = "0".repeat(9995);

        localStorage.foo = dataJustWithinQuota;
        sessionStorage.bar = dataJustWithinQuota;

        assert.strictEqual(localStorage.foo, dataJustWithinQuota);
        assert.strictEqual(sessionStorage.bar, dataJustWithinQuota);

        const dataExceedingQuota = "0".repeat(15000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });

    describe("set to 10000000 code units", () => {
      it("should only allow setting data within the custom quota", () => {
        const { localStorage, sessionStorage } = (new JSDOM(``, {
          url: "https://example.com",
          storageQuota: 10000000
        })).window;
        const dataWithinQuota = "0000000000".repeat(800000);

        localStorage.someKey = dataWithinQuota;
        sessionStorage.someKey = dataWithinQuota;

        assert.strictEqual(localStorage.someKey, dataWithinQuota);
        assert.strictEqual(sessionStorage.someKey, dataWithinQuota);

        const dataExceedingQuota = "0000000000".repeat(1100000);

        assert.throws(() => localStorage.setItem("foo", dataExceedingQuota));
        assert.throws(() => sessionStorage.setItem("bar", dataExceedingQuota));
      });
    });
  });
});
*/
