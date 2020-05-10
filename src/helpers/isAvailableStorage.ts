import { isWebStorageSupported, Storage } from '../';

export function isAvailableStorage(storage: Storage): boolean {
    if (isWebStorageSupported(storage) === false) {
        return false;
    }

    try {
        window[storage].setItem('test', 'test');
        window[storage].removeItem('test');

        return true;
    } catch (e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'QUOTA_EXCEEDED_ERR' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (window[storage] !== undefined && window[storage].length !== 0);
    }
}
