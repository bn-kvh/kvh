import levelup from 'levelup';
import leveldown from 'leveldown';
import { BaseStorage } from './BaseStorage';
import { Buffer } from 'buffer';

export class LevelStorage extends BaseStorage {
  constructor(public dbPath: string) {
    super();
  }
  protected kvhStore = this.createStore('kvh');
  createStore(dbName: string) {
    return levelup(leveldown(`${this.dbPath}/${dbName}`));
  }
  read(key: Uint8Array, height: number) {
    return new Promise<Uint8Array | undefined>((resolve) => {
      this.kvhStore.get(
        Buffer.concat([Buffer.from(new Uint32Array([height]).buffer), Buffer.from(key)]),
        (error, value) => {
          if (error) {
            resolve(undefined);
            return;
          }
          resolve(new Uint8Array(Buffer.from(value)));
        },
      );
    });
  }
  write(key: Uint8Array, height: number, value: Uint8Array) {
    return new Promise<void>((resolve, reject) => {
      this.kvhStore.put(
        Buffer.concat([Buffer.from(new Uint32Array([height]).buffer), Buffer.from(key)]),
        Buffer.from(value),
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        },
      );
    });
  }
  clear() {
    return this.kvhStore.clear();
  }
}
