import { IndexedStorage } from '@kvh/storage';
import test from 'ava';

// test('测试是否能正常读写数据', async (t) => {
//   const storage = createStore();
//   const height = 0;
//   const saveVal = new StringUtf8(`value::${height}`);
//   await storage.write(new StringUtf8('name'), saveVal, height);
//   const getVal = await storage.read(new StringUtf8('name'), height);
//   console.log(saveVal.getBytes());
//   console.log(getVal);
//   t.deepEqual(saveVal.getBytes(), getVal);
// });

function createStore() {
  return new IndexedStorage();
}
