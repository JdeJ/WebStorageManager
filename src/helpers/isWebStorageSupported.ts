import { Storage } from '../';

export function isWebStorageSupported(storage: Storage): boolean {
    try {
        return window[storage] !== undefined;
    } catch (e) {
        return false;
    }
}
