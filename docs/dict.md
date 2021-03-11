```ts
import { TYPE_FLAG } from '@kvh/typings';
import { EngineBuilder } from './engine/builder';
import { Int8Factory, StringUtf8, StringUtf8Factory } from './type';

(async () => {
  const dictEngine = await new EngineBuilder()
    .defineType(TYPE_FLAG.StringUtf8, StringUtf8Factory)
    .defineType(TYPE_FLAG.Int8, Int8Factory)
    .defineKey(new StringUtf8('address'), TYPE_FLAG.Int8)
    .defineKey(new StringUtf8('height'), TYPE_FLAG.Int8)
    .toEngine();
})();
class Dict {
  addWord(string);
}
```
