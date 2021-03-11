declare namespace KVH {
  /**
   * ## 统计插件
   *
   * 统计：空间占用、每类数据的条目数量
   */
  type StatisticsPlugin<KV extends KVH.DB.KV = any> = KVH.Plugin.Required<'transactionLoad' | 'transactionStore', KV>;
}
