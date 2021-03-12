import '@kvh/typings';
import { Database } from './Database';

class DatabaseKeyUnit<Template extends KVH.DB.GetKey<KVH.DBB.TV>>
  implements KVH.DB.KeyUnit<KVH.DBB.DatabaseKey<Template>> {
  constructor(public uri: KVH.DBB.DatabaseKey<Template>, public key: KVH.DB.GetKey<KVH.DBB.TV>) {}
  toString(): string {
    return this.key;
  }
  toBytes(): Uint8Array {
    return new TextEncoder().encode(this.key);
  }
}

export class KeyBuilder implements KVH.DatabaseBuilder {
  constructor(
    public aliasTypeMap: Map<string, KVH.DB.KeyCtor<KVH.DB.KeyUnit<string>>>,
    public templateValueMap: Map<string, KVH.DB.ValueCtor<KVH.DB.ValueUnit>>,
  ) {}
  /** 默认的实现方案，后续采用插件的形式去处理转换成bytes */
  build<Template extends KVH.DB.GetKey<KVH.DBB.TV>>(
    key: Template,
    params: KVH.DBB.BuildKeyParams<Template, KVH.DBB.AT<string, unknown>>,
  ): Util.PromiseMaybe<KVH.DB.KeyUnit<KVH.DBB.DatabaseKey<Template>>> {
    let transKey = key;
    for (let attr in params) {
      const typeObj = (params[attr] as unknown) as KVH.DB.ValueUnit;
      transKey = transKey.replace(new RegExp(`{${attr}:\\w+}`), typeObj.toString()) as Template;
    }
    return new DatabaseKeyUnit(key as KVH.DBB.DatabaseKey<Template>, transKey);
  }
  toDatabase(
    storage: KVH.Storage,
  ): Util.PromiseMaybe<KVH.Database<KVH.DBB.DatabaseKeyValue.Unit<string, KVH.DBB.TV<string, KVH.DB.ValueUnit>>>> {
    return new Database(this, storage);
  }
}
