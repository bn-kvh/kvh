import { IndexedStorage } from '@kvh/storage';
import test from 'ava';
const utf8Encoder = new TextEncoder();

test('测试是否能正常读写数据', async (t) => {
  const storage = createStore();
  const height = 0;
  const saveKey = utf8Encoder.encode(`name`);
  const saveVal = utf8Encoder.encode(`value::${height}`);
  await storage.write(saveKey, height, saveVal);
  const getVal = await storage.read(saveKey, height);
  t.deepEqual(saveVal, getVal);
});

function createStore() {
  return new IndexedStorage();
}
