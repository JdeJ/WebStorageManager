import { WebStorageManager } from './WebStorageManager';
import { WindowStorage } from './WindowStorage';

describe('Exporting classes.', () => {
    test('WebStorageManager is exported', () => {
        expect(WebStorageManager).toBeInstanceOf(Object);
    });
    test('WindowStorage is exported', () => {
        expect(WindowStorage).toBeInstanceOf(Object);
    });
});
