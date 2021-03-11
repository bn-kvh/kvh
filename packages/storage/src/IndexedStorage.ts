import 'fake-indexeddb/auto';
import { get, set, createStore, clear } from 'idb-keyval';
import { BaseStorage } from './BaseStorage';

export class IndexedStorage extends BaseStorage {
  read(key: Uint8Array, height: number) {
    return get<Uint8Array>([height, key]);
  }
  write(key: Uint8Array, height: number, value: Uint8Array) {
    return set([height, key], value);
  }
}
