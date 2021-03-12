declare namespace KVH {
  interface Database<T extends DB.KV = DB.KV> {
    open(height: number): Util.PromiseMaybe<DB.Transaction<T>>;
    get<K extends DB.GetKey<T>>(key: DB.KeyUnit<K>, height?: number): Util.PromiseMaybe<DB.GetResult<T, K> | undefined>;
    sub<K extends DB.GetKey<T>>(key: DB.KeyUnit<K>): DB.Subject<DB.GetResult<T, K>>;
    hook<K extends DB.GetKey<T>>(
      key: DB.KeyUnit<K>,
      pull: (height: number, key: K) => unknown,
    ): Util.PromiseMaybe<void>;
  }
  namespace DB {
    type KV<K extends string = string, V extends ValueUnit = ValueUnit> = { key: K; val: V };
    type GetKey<T> = T extends KV<infer K, infer _> ? K : never;
    type GetVal<T> = T extends KV<infer _, infer V> ? V : never;
    type GetValByKey<T, K> = T extends KV<infer Key, infer Value> ? (K extends Key ? Value : never) : never;
    type GetKeyByVal<T, V> = T extends KV<infer Key, infer Value> ? (Value extends V ? Key : never) : never;

    interface KeyUnit<S extends string = string> {
      readonly uri: S;
      toString(): string;
      toBytes(): Uint8Array;
    }
    interface ValueUnit {
      toBytes(): Uint8Array;
    }

    interface KeyCtor<T extends KVH.DB.KeyUnit> {
      new (): T;
    }

    interface ValueCtor<T extends KVH.DB.ValueUnit> {
      new (): T;
      fromBytes(bytes: Uint8Array): T;
    }

    type GetResult<T, K> = { key: K; value: DB.GetValByKey<T, K>; height: number; prevHeight: number };
    interface Subject<V> extends Evt.Attacher<V> {
      readonly uri: string;
      close(): void;
    }

    /**事务 */
    interface Transaction<T extends KV = KV> {
      readonly height: number;
      load<K extends DB.GetKey<T>>(key: K, height?: number): Util.PromiseMaybe<DB.GetValByKey<T, K>>;
      store<K extends DB.GetKey<T>>(key: K, value: DB.GetValByKey<T, K>): Util.PromiseMaybe<void>;
      add<K extends DB.GetKeyByVal<T, number>>(
        key: K,
        value: DB.GetValByKey<T, K>,
      ): Util.PromiseMaybe<DB.GetValByKey<T, K>>;
    }
  }
}
