## AST

> KVH 存储过程（Stored Procedure）

KVH 没有直接的数组的概念，数组本质是一种组合。
这里我们不直接提供数组，是因为考虑到并发。并发可以理解成就是一种异步的数组，所以我们将并发与数组两个概念组合在一起，设计出更加符合并发直觉的存储过程语言。

## 如何运行一个存储过程

```ts
const runner = await ast.start(); // create an instance
const { input, output } = runner;

const status1 = await input.yield(arg1); // return status1
const status2 = await input.yield(arg2); // return status2
const [status1, status2] = await input.yieldMany([arg1, arg2]);
const status1 = await input.yieldName('arg1', arg1);
input.close(); // close input, could not open again.

await output.get('const'); // return some var
await output.result(); // get final result
output.status(); // get current {data: any, isDone:boolean}
```

## 如何构建一个存储过程

```ts
const builder = await new AstBuilder(astRuntime);
const flow1 = builder.flowStartWithIn(typeFlag, "lang");
flow.waitInput("height", typeFlag);


const flow2 = builder.flowStartWithVoid();
flow2.get("somekey",10).
```

['zh-CN',Await<'fanyi-zh-cn'>,'en']

<!-- Collection:Map -->
<!-- In->Out -->

RuntimeBuilder.define('xx',ast)
RuntimeBuilder.define('math.log',ast)

builder = new AstBuilder(runtime)

<!-- builder. -->

height: 2
a<key> = 1<value> 2<height>
b<key> = a+1<ast> 2<value> 2<height>
f(x)<ast> = x+b<ast>

runner.close()
runner.output()

hook("a",(transaction)=>{
transaction.set("a", 1)
});

const runner = db.exec("x+1");
const { input, output } = runner;
input.yield(10)
input.close()

kvh => 共识计算器
交易 => 输入参数 Unit=>AssetIn("address","+100")/AssetOut("address","-100")/Freeze("address","12313")
transaction.save()
