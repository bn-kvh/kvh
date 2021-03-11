declare namespace KVH {
  /**协议接口层 */
  interface Engine {
    getHeight(): Util.PromiseMaybe<number>;
    getOne(key: Uint8Array, height: number): Util.PromiseMaybe<Uint8Array>;
    setOne(key: Uint8Array, height: number, value: Uint8Array): unknown;
    deleteOne(key: Uint8Array, height: number, toHeight?: number): unknown;
  }
  namespace Engine {}
}
