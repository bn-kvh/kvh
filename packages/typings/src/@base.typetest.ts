// import { Worker, isMainThread, workerData, parentPort as _parentPort, MessageChannel } from 'worker_threads';
// import { ReadableStream, ReadableStreamDefaultController } from 'web-streams-polyfill/ponyfill';
import { assert, IsExact } from 'conditional-type-checks';
class DatabaseValueUnit implements KVH.DB.ValueUnit {
  toBytes() {
    return new Uint8Array();
  }
}
class Height {}
class Address {}
class Equity extends DatabaseValueUnit {
  x = 2;
}
class Amount extends DatabaseValueUnit {
  z = 1;
}
const keyBuilderFactory = {} as KVH.DBB.Factory;

async function test() {
  const keyBuilder = keyBuilderFactory // v1
    .$defineAliasType<'Address', Address>()
    .$defineAliasType<'Equity', Equity>()
    .$defineTemplateValue<'{senderId:Address}.voteTo.{recipientId:Address}.equity', Equity>()
    .$defineTemplateValue<'{senderId:Address}.transferTo.{zzz:Address}.amount', Amount>()
    .toBuilder();

  const database = await keyBuilder.toDatabase();
  {
    const key1 = await keyBuilder.build('{senderId:Address}.voteTo.{recipientId:Address}.equity', {
      senderId: new Address(),
      recipientId: new Address(),
    });
    assert<
      IsExact<
        typeof key1,
        KVH.DB.KeyUnit<KVH.DBB.DatabaseKey<'{senderId:Address}.voteTo.{recipientId:Address}.equity'>>
      >
    >(true);

    const equity = (await database.get(key1))!;

    assert<IsExact<typeof equity.value, Equity>>(true);
  }

  {
    const key2 = await keyBuilder.build('{senderId:Address}.transferTo.{zzz:Address}.amount', {
      senderId: new Address(),
      zzz: new Address(),
    });
    assert<
      IsExact<typeof key2, KVH.DB.KeyUnit<KVH.DBB.DatabaseKey<'{senderId:Address}.transferTo.{zzz:Address}.amount'>>>
    >(true);

    const equity2 = (await database.get(key2, 199))!;

    assert<IsExact<typeof equity2.value, Amount>>(true);
  }
}
