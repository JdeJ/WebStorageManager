import { EventListenerCb, NavigatorSpace, STORE_SPACE_KEY, WebStorage } from "./types";
import { WindowStorage } from "./windowStorage";

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
    }

    static getInstance(webStorage: WebStorage): WebStorageManager {
        try {
            this.checkAvailability(webStorage);
            return new WebStorageManager(webStorage);
        } catch (e) {
            console.error(e);
            console.warn('Using "windowStorage", your changes will be lost if you refresh.');
            return new WebStorageManager('windowStorage');
        }
    }

    static checkAvailability(webStorage: WebStorage): void {
        this.checkSupported(webStorage);

        try {
            WebStorageManager[webStorage].setItem('test', new Array(513).join("a"));
            WebStorageManager[webStorage].removeItem('test');
        } catch (e) {
            if (e instanceof DOMException
                && (e.code === 21 ||
                    e.code === 22 ||
                    e.code === 1014 ||
                    e.name === 'QuotaExceededError' ||
                    e.name === 'QUOTA_EXCEEDED_ERR' ||
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
                && WebStorageManager[webStorage]?.length !== 0) {
                throw new Error(`WebStorage "${webStorage}" has no available space.`);
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
            throw new Error(`WebStorage "${webStorage}" is not supported.`)
        }
    }

    private static storageTest(webStorage: WebStorage): number {
        const storeSpaceValue = WebStorageManager[webStorage].getItem(STORE_SPACE_KEY);
        if (storeSpaceValue) {
            return Number(storeSpaceValue);
        }

        const store: { [key: string]: string | {} } = WebStorageManager.getContent(webStorage);
        let total = 0;
        let i = 0;
        const testValue = new Array(1025).join("a");
        const spaceMaxToTest = 1024 * 15;
        WebStorageManager[webStorage].clear();
        while (i < spaceMaxToTest) {
            try {
                WebStorageManager[webStorage].setItem(`${i}`, testValue);
            } catch (error) {
                total = (Math.floor(i * 100)) / 100;
                i = spaceMaxToTest + 1;
            }
            i++;
        }

        WebStorageManager[webStorage].clear();
        for (const key in store) {
            if (store.hasOwnProperty(key)) {
                WebStorageManager[webStorage].setItem(key, JSON.stringify(store[key]));
            }
        }
        total = Math.floor(Math.round(total * 100) / 100);
        WebStorageManager[webStorage].setItem(STORE_SPACE_KEY, JSON.stringify(total))
        return total;
    }

    static getContent(webStorage: WebStorage): {} {
        const content: { [key: string]: unknown } = {};

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

    setItem<T = string>(key: string, value: T): void {
        if (value === undefined) {
            throw new Error('"undefined" is not allowed value.')
        }

        const newKeySpace = Math.round((((key.length + JSON.stringify(value).length) * 2) / 1024 * 100)) / 100;
        if (newKeySpace >= this.getAvailableWebSpace()) {
            throw new Error(`There is not enough space in WebStorage "${this.type}".`)
        }

        this.storage.setItem(key, JSON.stringify(value));
        this.usedSpace = undefined;
        this.availableSpace = undefined;
    }

    getItem<T = string>(key: string): T | null {
        const i = this.storage.getItem(key);

        return i !== null ? <T>JSON.parse(i) : null;
    }

    key(index: number): string | null {
        return this.storage.key(index);
    }

    removeItem(key: string): void {
        if (!this.hasItem(key)) {
            throw new Error(`WebStorage "${this.type}" has no "${key}" key.`);
        }

        this.storage.removeItem(key);
        this.usedSpace = undefined;
        this.availableSpace = undefined;
    }

    clear(): void {
        this.storage.clear();
        this.usedSpace = undefined;
        this.availableSpace = undefined;
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

        this.usedSpace = Math.floor(Math.round(((this.toString().length * 2) / 1024) * 100) / 100);

        return this.usedSpace;
    }

    getKeyUsedSpace(key: string): number | undefined {
        return this.hasItem(key)
            ? this.usedSpace = Math.floor(Math.round((((key.length + this.getItem(key)!.length) * 2) / 1024 * 100)) / 100)
            : undefined;
    }

    getAvailableWebSpace(): number {
        const storeSpace = WebStorageManager.getStoreSpace(this.type);
        const usedSpace = this.getUsedSpace();

        this.availableSpace = Math.floor(storeSpace - usedSpace);

        return this.availableSpace;
    }

    toString(): string {
        return JSON.stringify(WebStorageManager.getContent(this.type));
    }

    addStoreChangeEvent(cb: EventListenerCb): void {
        window.addEventListener('storage', cb);
    }
}
