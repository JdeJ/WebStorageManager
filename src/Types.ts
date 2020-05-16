export type WebStorage = 'sessionStorage' | 'localStorage' | 'windowStorage';

export interface StoreItem {
    key: string;
    value: string;
}

export type EventListenerCb = (ev: StorageEvent) => unknown

export const STORE_SPACE_KEY = 'StoreSpace';

export type NavigatorSpace = {
    localStorage: number;
    sessionStorage: number;
};
