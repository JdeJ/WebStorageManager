import { isAvailableStorage, Storage, WebStorage } from "./";

export class WebStorageManager {
    private readonly storage: WebStorage | undefined;

    private constructor(storage: Storage = 'localStorage') {
        this.storage = window[storage];
    }

    static sayHello(hello: string, name: string): string {
        return `${hello} ${name}`;
    };

    getInstance(storage: Storage): WebStorageManager {
        if (isAvailableStorage(storage)) {
            return new WebStorageManager(storage);
        }

        throw new Error(`WebStorage '${storage}' is not available.`);
    }

    setKey<T>(key: string, value: T): void {
        if (this.storage !== undefined) {
            this.storage.setItem(key, JSON.stringify(value));
        }
    }

    getKey<T = string>(key: string): T | string | undefined {
        let value = undefined;

        if (this.storage !== undefined) {
            const i = this.storage.getItem(key);

            if (i !== null) {
                try {
                    value = <T>JSON.parse(i);
                } catch (error) {
                    value = i;
                }
            }

        }

        return value;
    }

    removeKey(key: string): void {
        if (this.storage !== undefined) {
            this.storage.removeItem(key);
        }
    }

    hasKey(key: string): boolean {
        if (this.storage !== undefined) {
            return this.getKey(key) !== undefined;
        }

        return false;
    }

    clearAll(): void {
        if (this.storage !== undefined) {
            this.storage.clear();
        }
    }
}
