import { Item, NavigatorSpace, STORE_SPACE_KEY, Value, WebStorage, EventListenerCb } from './types';
import { WindowStorage } from './windowStorage';

export class WebStorageManager implements Storage {
	private static readonly windowStorage: Storage = new WindowStorage();
	private static readonly localStorage: Storage = window.localStorage;
	private static readonly sessionStorage: Storage = window.sessionStorage;
	private readonly storage: Storage;
	private readonly type: WebStorage;
	private usedSpace: number | undefined;
	private availableSpace: number | undefined;

	private constructor(webStorage: WebStorage = 'localStorage') {
		this.type = webStorage;
		this.storage = WebStorageManager[webStorage];

		this.storeChangeListener();
	}

	static getInstance(webStorage: WebStorage): WebStorageManager {
		try {
			this.checkAvailability(webStorage);
			return new WebStorageManager(webStorage);
		} catch (e) {
			console.error(e);
			console.warn(
				'Using "windowStorage", your changes will be lost if you refresh.'
			);
			return new WebStorageManager('windowStorage');
		}
	}

	static checkAvailability(webStorage: WebStorage): void {
		this.checkSupported(webStorage);

		try {
			WebStorageManager[webStorage].setItem(
				'test',
				new Array(513).join('a')
			);
			WebStorageManager[webStorage].removeItem('test');
		} catch (e) {
			if (
				e instanceof DOMException &&
				(e.code === 21 ||
					e.code === 22 ||
					e.code === 1014 ||
					e.name === 'QuotaExceededError' ||
					e.name === 'QUOTA_EXCEEDED_ERR' ||
					e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				WebStorageManager[webStorage]?.length !== 0
			) {
				throw new Error(
					`WebStorage "${webStorage}" has no available space.`
				);
			}

			throw new Error(`WebStorage "${webStorage}" is not available.`);
		}
	}

	static getNavigatorSpace(): NavigatorSpace {
		return {
			localStorage: this.getStoreSpace('localStorage'),
			sessionStorage: this.getStoreSpace('sessionStorage')
		};
	}

	static getStoreSpace(webStorage: WebStorage): number {
		this.checkSupported(webStorage);
		return this.storageTest(webStorage);
	}

	private static checkSupported(webStorage: WebStorage): void {
		if (WebStorageManager[webStorage] === undefined) {
			throw new Error(`WebStorage "${webStorage}" is not supported.`);
		}
	}

	private static storageTest(webStorage: WebStorage): number {
		if (webStorage === 'windowStorage') {
			return 9999999999;
		}

		const storeSpaceValue = WebStorageManager[webStorage].getItem(
			STORE_SPACE_KEY
		);
		if (storeSpaceValue) {
			return Number(JSON.parse(storeSpaceValue).data);
		}

		const store: Record<string, unknown> = WebStorageManager.getContent(
			webStorage
		);
		let total = 0;
		let i = 0;
		const testValue = 'a'.repeat(1024);
		const spaceMaxToTest = 1024 * 10;
		WebStorageManager[webStorage].clear();

		while (i <= spaceMaxToTest) {
			try {
				WebStorageManager[webStorage].setItem(`${i}`, testValue);
			} catch (error) {
				total = i;
				i = spaceMaxToTest + 1;
			}
			i++;
		}

		WebStorageManager[webStorage].clear();

		for (const key in store) {
			if (store.hasOwnProperty(key)) {
				WebStorageManager[webStorage].setItem(
					key,
					JSON.stringify(store[key])
				);
			}
		}

		WebStorageManager[webStorage].setItem(
			STORE_SPACE_KEY,
			JSON.stringify({ data: total, expires: 0 })
		);

		return total;
	}

	static getContent(webStorage: WebStorage): Record<string, unknown> {
		const content: Record<string, unknown> = {};

		for (const key in WebStorageManager[webStorage]) {
			if (WebStorageManager[webStorage].hasOwnProperty(key)) {
				content[key] = WebStorageManager[webStorage][key];
			}
		}

		return content;
	}

	get length(): number {
		return this.storage.length;
	}

	get [Symbol.toStringTag]() {
		return 'WebStorageManager';
	}

	setItem<T = string>(key: string, value: T, expires?: number): void {
		if (value === undefined) {
			throw new Error('"undefined" is not allowed value.');
		}

		const data: Value<T> = {
			data: value,
			expires: expires !== undefined ? expires + Date.now() : 0
		};

		const newKeySpace = this.getSpaceNeededForItem({ key, value: data })


		if (newKeySpace >= this.getAvailableWebSpace()) {
			throw new Error(
				`There is not enough space in WebStorage "${this.type}".`
			);
		}

		this.addItemSizeToUsedSpace(newKeySpace);
		this.removeItemSizeFromAvailableSpace(newKeySpace);
		this.storage.setItem(key, JSON.stringify(data));
	}

	getItem<T = string>(key: string): T | null {
		const i = this.storage.getItem(key);

		if (i === null) {
			return null;
		}

		const value: Value<T> = <Value<T>>JSON.parse(i);

		if (value.expires > 0 && value.expires - Date.now() < 0) {
			this.removeItem(key);
			throw new Error(
				`The key "${key}" is no longer available (availability expires).`
			);
		}

		return value.data;
	}

	key(index: number): string | null {
		return this.storage.key(index);
	}

	removeItem<T = string>(key: string): void {
		const i = this.storage.getItem(key);

		if (i === null) {
			throw new Error(`WebStorage "${this.type}" has no "${key}" key.`);
		}

		const item: Item<T> = { key, value: <Value<T>>JSON.parse(i) }
		const itemSize = this.getSpaceNeededForItem(item)

		this.removeItemSizeFromUsedSpace(itemSize);
		this.addItemSizeToAvailableSpace(itemSize);
		this.storage.removeItem(key);
	}

	clear(): void {
		this.storage.clear();
		this.usedSpace = 0;
		this.availableSpace = this.getAvailableWebSpace();
	}

	hasItem(key: string): boolean {
		return this.storage[key] !== undefined;
	}

	getKeys(): string[] {
		return Object.keys(this.storage);
	}

	getUsedSpace(): number {
		if (this.usedSpace !== undefined) {
			return this.usedSpace;
		}

		this.usedSpace = Math.floor(
			Math.round(((this.toString().length * 2) / 1024) * 100) / 100
		);

		return this.usedSpace;
	}


	getKeyUsedSpace(key: string): number | undefined {
		return this.hasItem(key)
			? (this.usedSpace = Math.floor(
				Math.round(
					(((key.length + this.getItem(key)!.length) * 2) /
						1024) *
					100
				) / 100
			))
			: undefined;
	}

	private getSpaceNeededForItem<T>(item: Item<T>): number {
		return Math.floor(Math.round(
			(((item.key.length + JSON.stringify(item.value).length) * 2) / 1024) * 100
		) / 100);
	}

	private getAvailableWebSpace(): number {
		if (this.availableSpace !== undefined) {
			return this.availableSpace;
		}

		const storeSpace = WebStorageManager.getStoreSpace(this.type);
		const usedSpace = this.getUsedSpace();

		this.availableSpace = Math.floor(storeSpace - usedSpace);

		return this.availableSpace;
	}

	toString(): string {
		return JSON.stringify(WebStorageManager.getContent(this.type));
	}

	private addItemSizeToUsedSpace(itemSize: number): void {
		this.usedSpace = this.getUsedSpace() + itemSize
	}

	private removeItemSizeFromUsedSpace(itemSize: number): void {
		this.usedSpace = this.getUsedSpace() - itemSize
	}

	private addItemSizeToAvailableSpace(itemSize: number): void {
		this.availableSpace = this.getAvailableWebSpace() - itemSize
	}

	private removeItemSizeFromAvailableSpace(itemSize: number): void {
		this.availableSpace = this.getAvailableWebSpace() + itemSize
	}

	addStoreChangeEvent(cb: EventListenerCb): void {
		this.storeChangeListener(cb);
	}

	private storeChangeListener(cb?: EventListenerCb): void {
		window.addEventListener('storage', (ev: StorageEvent) => {
			let str;

			if (ev.newValue === null) {
				str = `The key '${ev.key}' has been removed.`;
			} else if (ev.oldValue === null) {
				str = `New key has been addded: {Key: ${ev.key}, Value:${ev.newValue}}`;
			} else {
				str = `The key '${ev.key}' has been changed. New Value: ${ev.newValue}.`;
			}

			console.warn(str);

			this.usedSpace = undefined;
			this.availableSpace = undefined;
			if (cb !== undefined) {
				cb(ev);
			}
		});
	}
}
