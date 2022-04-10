export type WebStorage = 'sessionStorage' | 'localStorage' | 'windowStorage';

export interface Item<T> {
    key: string;
    value: Value<T>;
}

export interface Value<T> {
    data: T;
    expires: number;
};

export type EventListenerCb = (event: StorageEvent) => void

export const STORE_SPACE_KEY = 'StoreSpace';

export type NavigatorSpace = {
    localStorage: number;
    sessionStorage: number;
};
