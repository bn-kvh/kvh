declare namespace KVH {
  interface DatabaseBuilder<AliasType extends DBB.AT = DBB.AT, TemplateValue extends DBB.TV = DBB.TV> {
    build<Template extends DB.GetKey<TemplateValue>>(
      key: Template,
      params: DBB.BuildKeyParams<Template, AliasType>,
    ): Util.PromiseMaybe<DB.KeyUnit<DBB.DatabaseKey<Template>>>;
    toDatabase(storage: Storage): Util.PromiseMaybe<Database<DBB.DatabaseKeyValue<AliasType, TemplateValue>>>;
  }
  namespace DBB {
    type TV<K extends string = string, V extends DB.ValueUnit = DB.ValueUnit> = { key: K; val: V };
    type GetTemplate<T> = T extends TV<infer K, infer _> ? K : never;
    type GetValue<T> = T extends TV<infer _, infer V> ? V : never;
    type GetValueByTemplate<T, K> = T extends TV<infer Key, infer Value> ? (K extends Key ? Value : never) : never;
    // type GetTemplateByValue<T, V> = T extends TV<infer Key, infer Value> ? (Value extends V ? Key : never) : never;

    type AT<K extends string = string, V = unknown> = { key: K; val: V };
    type GetAlias<T> = T extends AT<infer Alias, infer _> ? Alias : never;
    type GetType<T> = T extends AT<infer _, infer Type> ? Type : never;
    type GetTypeByAlias<T, K> = T extends AT<infer Alias, infer Type> ? (K extends Alias ? Type : never) : never;
    // type GetAliasByType<T, V> = T extends AT<infer Key, infer Type> ? (Type extends V ? Key : never) : never;

    interface Factory<AliasType extends DBB.AT = never, TemplateValue extends TV = never> {
      $defineAliasType<Alias extends string, Type extends KVH.DB.KeyUnit<string>>(
        name: Alias,
        type: KVH.DB.KeyCtor<Type>,
      ): Factory<AliasType | DBB.AT<Alias, Type>>;
      $defineTemplateValue<Template extends string, Value extends DB.ValueUnit>(
        template: Template,
        value: KVH.DB.ValueCtor<Value>,
      ): Factory<AliasType, TemplateValue | TV<Template, Value>>;
      toBuilder(): DatabaseBuilder<AliasType, TemplateValue>;
    }

    type BuildKeyParams<Template, AliasType extends AT> = Template extends `${infer Left}.${infer Right}`
      ? BuildKeyParams.Unit<Left, AliasType> & BuildKeyParams<Right, AliasType>
      : BuildKeyParams.Unit<Template, AliasType>;
    namespace BuildKeyParams {
      type Unit<Template, AliasType extends AT> = Template extends `{${infer Key}:${infer Alias}}`
        ? { [K in Key]: GetTypeByAlias<AliasType, Alias> }
        : {};
    }

    type DatabaseKey<Template> = Template extends `${infer Left}.${infer Right}`
      ? `${DatabaseKey.Unit<Left>}.${DatabaseKey<Right>}`
      : DatabaseKey.Unit<Template>;
    namespace DatabaseKey {
      type Unit<Template> = Template extends `{${infer _}}` ? `{${string}}` : Template;
    }
    type DatabaseKeyValue<AliasType extends AT, TemplateValue extends TV> = {
      [Template in GetTemplate<TemplateValue>]: DatabaseKeyValue.Unit<Template, TemplateValue>;
    }[GetTemplate<TemplateValue>];

    namespace DatabaseKeyValue {
      type Unit<Template extends string, TemplateValue extends TV> = TV<
        DatabaseKey<Template>,
        DB.GetValByKey<TemplateValue, Template>
      >;
      // type ObjIgnoreKeys<O extends {}> = O[keyof O];
    }
  }
}
