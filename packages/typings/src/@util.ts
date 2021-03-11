declare namespace Util {
  type PromiseMaybe<T> = T | PromiseLike<T>;
  type Ref<T> = { content: T };
}
