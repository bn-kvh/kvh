import 'fake-indexeddb/auto';
import { get, set, createStore, clear, del } from 'idb-keyval';
import { BaseStorage } from './BaseStorage';

export class IndexedStorage extends BaseStorage {
  constructor(public dbPath: string = 'bfchain') {
    super();
  }
  protected kvhStore = this.createStore('kvh');
  protected createStore(dbName: string) {
    return createStore(this.dbPath, dbName);
  }
  free(key: Uint8Array, height: number): Util.PromiseMaybe<void> {
    del([height, key], this.kvhStore);
  }
  read(key: Uint8Array, height: number) {
    return get<Uint8Array>([height, key], this.kvhStore);
  }
  write(key: Uint8Array, height: number, value: Uint8Array) {
    return set([height, key], value, this.kvhStore);
  }
  clear() {
    return clear(this.kvhStore);
  }
}
