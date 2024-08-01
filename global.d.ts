// GlobalComponents for Volar
import type {
  ComponentPublicInstance,
  ComputedRef,
  FunctionalComponent,
  Ref,
  VNode,
  VNodeChild,
} from 'vue';
import type { PropType as VuePropType } from '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // ElAffix: typeof import('p-helper')['ElAffix']
    TestComponent: typeof import('@p-helper/components')['TestComponent'];
    PWaterfall: typeof import('@p-helper/components')['PWaterfall'];
  }

  // interface ComponentCustomProperties {
  //   // $message: typeof import('p-helper')['ElMessage']
  // }
}

declare global {
  type Nullable<T> = T | null;
  // export type NonNullable<T> = T extends null | undefined ? never : T;
  type Recordable<T = any> = Record<string, T>;
  type EmitType = (...args: any[]) => any;
  export interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }
  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
  type LabelValueOptions = {
    label: string;
    value?: any;
    [key: string]: string | number | boolean;
  }[];

  interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T;
  }

  type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null;
  type TargetContext = '_self' | '_blank';
  interface WheelEvent {
    path?: EventTarget[];
  }

  function parseInt(s: string | number, radix?: number): number;

  function parseFloat(string: string | number): number;
  type DynamicProps<T> = {
    [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
  };

  // vue
  type PropType<T> = VuePropType<T>;
  type VueNode = VNodeChild | JSX.Element;
  interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>;
  }
}
declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}

export {};
