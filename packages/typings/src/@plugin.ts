declare namespace KVH {
  /**定义插件
   * 提供生命周期钩子
   * 基于插件，开发者可以实现对：数据的压缩算法、自定义数据的存储方案、对数据的统计、以及在开发者工具中的各种拓展
   *
   * 插件一定要安装在和数据库一样的线程里，但因为异步，并不排斥插件的一些逻辑在其它线程运行
   */
  interface Plugin<KV extends KVH.DB.KV = any> extends Plugin.Base<KV>, Partial<Plugin.Hookers<KV>> {}

  namespace Plugin {
    type Piper<I, O> = { params: Readonly<I>; pipe: (out?: O) => void };

    /**插件的必选属性 */
    interface Base<KV extends KVH.DB.KV> {
      /**插件的名称 */
      readonly name: string;
      /**插件的关键字信息，用于进一步描述插件 */
      readonly keywords: ReadonlySet<unknown>;
      /**与其它插件做排序的策略 */
      order(otherPlugin: Plugin<KV>): 0 | 1 | -1;
    }

    /**对象与二进制互转的钩子 */
    interface BytesHooker<KV extends KVH.DB.KV> {
      /**自定义key转bytes */
      keyToBytes<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            key: KVH.DB.KeyUnit<K>;
            keyBytes?: Uint8Array;
          },
          { keyBytes: Uint8Array }
        >,
      ): unknown;
      /**自定义value转bytes */
      valueToBytes<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            value: KVH.DB.GetValByKey<KV, K>;
            valueBytes?: Uint8Array;
            key: KVH.DB.KeyUnit<K>;
            height: number;
          },
          { valueBytes: Uint8Array }
        >,
      ): unknown;
      bytesToKey<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            keyBytes: Uint8Array;
            key?: KVH.DB.KeyUnit<K>;
          },
          { key: KVH.DB.KeyUnit<K> }
        >,
      ): unknown;
      bytesToValue<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            valueBytes: Uint8Array;
            value?: KVH.DB.GetValByKey<KV, K>;
            key: KVH.DB.KeyUnit<K>;
            height: number;
          },
          { value?: KVH.DB.GetValByKey<KV, K> }
        >,
      ): unknown;
    }

    /**事务的钩子 */
    interface TransactionHooker<KV extends KVH.DB.KV> {
      /**在准备写入数据库前 */
      transactionStore<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            transaction: KVH.DB.Transaction;
            key: KVH.DB.KeyUnit<K>;
            keyBytes: Uint8Array;
            value: KVH.DB.GetValByKey<KV, K>;
            valueBytes: Uint8Array;
            height: number;
          },
          { keyBytes: Uint8Array; valueBytes: Uint8Array }
        >,
      ): unknown;
      /**数据读出来时 */
      transactionLoad<K extends KVH.DB.GetKey<KV>>(
        piper: Plugin.Piper<
          {
            key: KVH.DB.KeyUnit<K>;
            keyBytes: Uint8Array;
            valueBytes: Uint8Array;
            value?: KVH.DB.GetValByKey<KV, K>;
            height: number;
          },
          { value: KVH.DB.GetValByKey<KV, K> }
        >,
      ): unknown;
      // type a = Required
    }

    /**开发者工具的钩子 */
    interface DevtoolsHooker<KV extends KVH.DB.KV> {}

    type Hookers<KV extends KVH.DB.KV> = BytesHooker<KV> & TransactionHooker<KV> & DevtoolsHooker<KV>;

    type Required<Keys extends keyof Hookers<KV>, KV extends KVH.DB.KV = any> = Plugin<KV> &
      { [K in Keys]-?: Plugin<KV>[K] };
  }
}
