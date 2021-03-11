declare namespace KVH {
  /**底层的读写接口
   * Browser依赖于IndexedDB
   * Nodejs依赖于LevelDB
   */
  interface Storage {
    read(key: Uint8Array, height: number): Util.PromiseMaybe<Uint8Array | undefined>;
    write(key: Uint8Array, height: number, value: Uint8Array): Util.PromiseMaybe<void>;
    free(key: Uint8Array, height: number): Util.PromiseMaybe<void>;
  }
}
