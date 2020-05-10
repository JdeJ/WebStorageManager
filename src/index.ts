export { isAvailableStorage, isWebStorageSupported } from './helpers';
export { Storage, WebStorage } from './Types';

import { WebStorageManager } from "./WebStorageManager";
export default WebStorageManager;
Object.assign(module.exports, WebStorageManager);