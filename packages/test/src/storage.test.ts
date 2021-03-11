import { LevelStorage } from '@kvh/storage';
// import { StringUtf8 } from '@kvh/demo';
import test from 'ava';
import fs from 'fs';
import path from 'path';
const testDir = path.join(__dirname, '../data');
try {
  rmdir(testDir);
} catch {}

const utf8Encoder = new TextEncoder();

test('测试是否能正常读写数据', async (t) => {
  const storage = createStore();
  const height = 0;
  const saveKey = utf8Encoder.encode(`name`);
  const saveVal = utf8Encoder.encode(`value::${height}`);
  await storage.write(saveKey, height, saveVal);
  const getVal = await storage.read(saveKey, height);
  t.deepEqual(saveVal, getVal && new Uint8Array(getVal));
});

function rmdir(dir: string) {
  const files = fs.readdirSync(dir);
  function next(index: number) {
    if (index == files.length) return fs.rmdirSync(dir);
    let newPath = path.join(dir, files[index]);
    const stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      rmdir(newPath);
      next(index + 1);
    } else {
      fs.unlinkSync(newPath);
      next(index + 1);
    }
  }
  next(0);
}

function createStore() {
  return new LevelStorage(`${testDir}/${Math.random()}`);
}
