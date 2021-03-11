import { LevelStorage } from '@kvh/storage';
// import { StringUtf8 } from '@kvh/demo';
import test from 'ava';
import fs from 'fs';
import path from 'path';
const testDir = path.join(__dirname, '../data');
try {
  rmdir(testDir);
} catch {}

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
