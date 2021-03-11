import levelup from 'levelup';
import leveldown from 'leveldown';
import type { AbstractLevelDOWN } from 'abstract-leveldown';
import { BaseStorage } from './BaseStorage';
import { Buffer } from 'buffer';

export class LevelStorage extends BaseStorage {
  constructor(public dbPath: string) {
    super();
  }
  protected kvhStore = this.createStore('kvh');
  protected createStore(dbName: string) {
    const down = (leveldown(`${this.dbPath}/${dbName}`) as unknown) as AbstractLevelDOWN<
      Uint8Array,
      Uint8Array | undefined
    >;
    return levelup(down);
  }
  protected _getKey(key: Uint8Array, height: number) {
    return Buffer.concat([Buffer.from(new Uint32Array([height]).buffer), Buffer.from(key)]);
  }
  read(key: Uint8Array, height: number) {
    return this.kvhStore.get(this._getKey(key, height));
  }
  write(key: Uint8Array, height: number, value: Uint8Array) {
    return this.kvhStore.put(this._getKey(key, height), Buffer.from(value));
  }
  free(key: Uint8Array, height: number): Util.PromiseMaybe<void> {
    return this.kvhStore.del(this._getKey(key, height));
  }
  clear() {
    return this.kvhStore.clear();
  }
}
