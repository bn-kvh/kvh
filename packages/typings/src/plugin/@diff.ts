declare namespace KVH {
  /**
   * ## 存储压缩插件
   *
   *
   * 默认情况下，kvh的存储逻辑是直接全量存储新的值。这是直观的。
   * 但这样也带来了大量存储空间的消耗。
   * 所以这里使用diff算法，使用CPU换存储。来对低频使用的数据进行有意识地压缩
   */
  type DiffPlugin<KV extends KVH.DB.KV = any> = KVH.Plugin.Required<'transactionLoad' | 'transactionStore', KV>;
}
