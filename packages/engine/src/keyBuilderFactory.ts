import '@kvh/typings';
import { KeyBuilder } from './keyBuilder';

class KeyBuilderFactory implements KVH.DBB.Factory {
  protected _aliasTypeMap: Map<string, KVH.DB.KeyCtor<KVH.DB.KeyUnit<string>>> = new Map();
  protected _templateValueMap: Map<string, KVH.DB.ValueCtor<KVH.DB.ValueUnit>> = new Map();
  $defineAliasType<Alias extends string, Type extends KVH.DB.KeyUnit<string>>(
    name: Alias,
    type: KVH.DB.KeyCtor<Type>,
  ): KVH.DBB.Factory<KVH.DBB.AT | KVH.DBB.AT<Alias, Type>> {
    this._aliasTypeMap.set(name, type);
    return this;
  }
  $defineTemplateValue<Template extends string, Value extends KVH.DB.ValueUnit>(
    template: Template,
    value: KVH.DB.ValueCtor<Value>,
  ): KVH.DBB.Factory<KVH.DBB.AT, KVH.DBB.TV | KVH.DBB.TV<Template, Value>> {
    this._templateValueMap.set(template, value);
    return this;
  }
  toBuilder(): KVH.DatabaseBuilder<KVH.DBB.AT, KVH.DBB.TV> {
    return new KeyBuilder(this._aliasTypeMap, this._templateValueMap);
  }
}

export const keyBuilderFactory = new KeyBuilderFactory();
