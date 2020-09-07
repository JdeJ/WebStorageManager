import { WebStorage } from './types';
import { WebStorageManager } from './WebStorageManager';
import { advanceBy } from 'jest-date-mock';

describe('WebStorage space ', () => {
	test.each([
		['sessionStorage', 4864],
		['localStorage', 4864],
		['windowStorage', 9999999999]
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

describe('Must store at localStorage ', () => {
	const storage = WebStorageManager.getInstance('localStorage');

	afterEach(() => {
		storage.clear();
	});

	test.each([
		[{ key: 'foo', value: 1 }, 1],
		[{ key: 'bar', value: 'a'.repeat(10) }, 'a'.repeat(10)]
	])(
		'%o and return %s',
		(data, expected) => {
			storage.setItem(data.key, data.value);

			expect(storage.getItem(data.key)).toEqual(expected);
		},
		5
	);

	test('Must throw error if setting item with value "undefined"', () => {
		function setUndefinedItem() {
			storage.setItem('undefined', undefined);
		}

		expect(setUndefinedItem).toThrowError(
			new Error('"undefined" is not allowed value.')
		);
	});

	test('Must throw error if not enough space', () => {
		function setTooBigItem() {
			storage.setItem('tooBig', 'a'.repeat(10000000));
		}

		expect(setTooBigItem).toThrowError(
			new Error('There is not enough space in WebStorage "localStorage".')
		);
	});

	test('Must fail if WebStorage has no available space', () => {
		storage.setItem('foo', 'a'.repeat(1000000));

		expect(() => storage.setItem('bar', 'b'.repeat(9000000))).toThrowError(
			new Error('There is not enough space in WebStorage "localStorage".')
		);
	});
});

describe('Must return from localStorage ', () => {
	const storage = WebStorageManager.getInstance('localStorage');

	beforeEach(() => {
		storage.setItem('foo', 'bar');
	});

	afterEach(() => {
		storage.clear();
	});

	test('Must return "bar" from "foo" key', () => {
		expect(storage.getItem('foo')).toEqual('bar');
	});

	test('Must throw error if data availability expires', () => {
		storage.setItem('dataExpired', 'foo', 5000);

		advanceBy(4000);
		expect(storage.getItem('dataExpired')).toEqual('foo');

		advanceBy(2000);
		expect(() => storage.getItem('dataExpired')).toThrowError(
			new Error(
				'The key "dataExpired" is no longer available (availability expires).'
			)
		);
	});

	test('Must return "null" if item doesn\'t exists on storage', () => {
		expect(storage.getItem('bar')).toBeNull;
	});
});

test('Must fail while removing unstored key', () => {
	const storage = WebStorageManager.getInstance('localStorage');

	expect(() => storage.removeItem('foo')).toThrowError(
		new Error('WebStorage "localStorage" has no "foo" key.')
	);
});

// describe('Must fail if WebStorage is not supported', () => {
// 	const dom = new jsdom.JSDOM('', {
// 		url: 'https://example.org/',
// 		referrer: 'https://example.com/',
// 		contentType: 'text/html',
// 		includeNodeLocations: true,
// 		storageQuota: 5000000,
// 	});
// 	dom.window.localStorage = undefined;
// 	expect(() => WebStorageManager.getInstance('localStorage')).toThrowError(
// 		new Error('WebStorage "localStorage" is not supported.')
// 	);
// });

// describe('Must use WindowStorage if webStorage is not available', () => {});

// test store change events
