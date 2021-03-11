# kvh 压缩算法

在聊 kvh 压缩算法时，只是指“本机”算法的实现，因为 kvh 本身并不约束算法的实现。
我们基于 kvh 来实现区块链的关键检查点，在一个对外的检查点数据格式中，使用 kvh 数据库导出的数据是完整的 key-value-height，它是冗余，也是准确的。

1. #### 定义数据库的 key

   和传统的 kv 数据库不同，kvh 中所有的 key 必须事先定义好。也就意味着，在一开始 kvh 中有多少个字段其实是已经固定的了。
   可以这样理解：将这些固定的 key，就是一个 MySql 数据库中固定的 table。

   ```ts
   engineBuilder.defineKey(new StringUtf8(`username`), TYPE_FLAG.UserName);
   ```

   ##### 压缩算法

   因为是完全固定的 key，所以我们一开始就能为其构建索引，也就是说，数据库中是不会存储`StringUtf8('username')`的，
   而是：`key:<00,01>,value:<username-bytes>`。
   其中,开头的第一位`00`代表着“表的 ID”，因为后续还会有“内建表”，届时它们将使用不同的 id 进行区分。因为是`Fixed32`的格式，所以这里只用了一位。
   然后是`01`代表着`StringUtf8('username')`的索引

1. #### 所以，kvh 必须依赖多级 key 来实现动态特性。

   ```ts
   /// 定义key
   engineBuilder.defineMultiLevelKey(
     new StringUtf8(`country.user.age`),
     [TYPE_FLAG.Country, TYPE_FLAG.UserName] as const,
     TYPE_FLAG.Age,
   );

   const userAgeTable = engine.get(
     /* key */ new StringUtf8(`country.user.age`),
     [new Country('zh-CN'), new UserName('张三')],
     /* height? */ 100,
   );
   const userAgeTable = engine.get(
     /* key */ new StringUtf8(`country.user.age`),
     [new Country('zh-CN'), new UserName('李四')],
     /* height? */ 100,
   );
   ```

   ##### 原理

   多级 key，在默认情况下其实和单级 key 一样，我们也是将之连接成一个 bytes 进行存储：
   假设字典中`StringUtf8('country.user.age')`就是`<02>`，那么这个完整的 key 就是：
   `key:<00,02,...Country('zh-CN'),...UserName('张三')>`。
   此时你会发现，`<00,02>`这个开头始终是固定的，所以前面我们提到“内建表”，就会在这里开始起作用：
   `key:<00,02>,value:<01>`这里，我们为`<00,02>`这个表头定义了一个“表 ID”`<01>`，那么原本的 key 就会变成：
   `key:<01,...Country('zh-CN'),...UserName('张三')>`

1. #### 多级 key 可以通过建立索引来优化存储

   对于顶级的 key，kvh 会自动将之字典化，也就是索引。
   而对于子集的 key，因为动态特性，默认是不为其建立字典的。但开发者可以指定类型来使之自建字典

   ```ts
   engineBuilder
     .defineType(TYPE_FLAG.UserName, UserNameFactory) // 定义类型
     .useIndex(TYPE_FLAG.UserName, Fixed32IndexFactory); // 使用索引
   ```

1. #### kvh 不可以删除 key，也不能修改 key 的类型，只能通过升级来增加 key。

   ```ts
   class MyDB {
     engine!: Engine,
     enginev2: this.engine
                 .upgrade({version: 2})
                 .defineKey(new StringUtf8(`username2`), TYPE_FLAG.MartianName)
                 .toEngine()
   }
   ```

1. #### kvh 中没有内建的搜索功能，只有存粹的 get
   为了精确控制存储的使用，kvh 默认不提供 query 功能，但开发者可以自行构建
