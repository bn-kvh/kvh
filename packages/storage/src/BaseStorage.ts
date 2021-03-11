export abstract class BaseStorage implements KVH.Storage {
  abstract read(key: Uint8Array, height: number): Util.PromiseMaybe<Uint8Array | undefined>;
  abstract write(key: Uint8Array, height: number, value: Uint8Array): Util.PromiseMaybe<void>;
}
