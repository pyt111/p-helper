import type { ComputedRef, Ref } from 'vue';

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}
