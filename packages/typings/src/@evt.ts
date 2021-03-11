declare namespace Evt {
  interface Evt<T> extends Attacher<T>, Poster<T> {}
  interface Attacher<V> {
    attach(cb: (data: V) => unknown): void;
    detach(cb: (data: V) => unknown): boolean;
  }
  interface Poster<V> {
    post(data: V): void;
  }
}
