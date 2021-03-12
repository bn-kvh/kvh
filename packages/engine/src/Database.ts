import type { BaseStorage } from '@kvh/storage';
import type { KeyBuilder } from './keyBuilder';

export class Database implements KVH.Database {
  constructor(public keyBuilder: KeyBuilder, protected storage: BaseStorage) {}
  async get<K extends string>(
    key: KVH.DB.KeyUnit<K>,
    height?: number,
  ): Promise<KVH.DB.GetResult<KVH.DB.KV<string, KVH.DB.ValueUnit>, K> | undefined> {
    /// 等待baseStorage返回值的变化
    const valU8a = await this.storage.read(key.toBytes(), height || 0);
    if (valU8a === undefined) {
      return undefined;
    }
    const valueTypeClass = this.keyBuilder.templateValueMap.get(key.uri)!;
    const value = valueTypeClass.fromBytes(valU8a);
    return {
      key: key.uri,
      value,
      height: 0,
      prevHeight: 0,
    } as KVH.DB.GetResult<KVH.DB.KV<string, KVH.DB.ValueUnit>, K>;
  }
  sub<K extends string>(
    key: KVH.DB.KeyUnit<K>,
  ): KVH.DB.Subject<KVH.DB.GetResult<KVH.DB.KV<string, KVH.DB.ValueUnit>, K>> {
    throw new Error('Method not implemented.');
  }
  hook<K extends string>(key: KVH.DB.KeyUnit<K>, pull: (height: number, key: K) => unknown): Util.PromiseMaybe<void> {
    throw new Error('Method not implemented.');
  }
  open(height: number): Util.PromiseMaybe<KVH.DB.Transaction<KVH.DB.KV<string, KVH.DB.ValueUnit>>> {
    throw new Error('Method not implemented.');
  }
}
