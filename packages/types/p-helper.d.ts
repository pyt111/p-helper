import type {
  ComponentPublicInstance,
  ComputedRef,
  FunctionalComponent,
  Ref,
  VNode,
  VNodeChild,
  PropType as VuePropType,
} from 'vue';

declare global {
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type EmitType = (...args: any[]) => any;
  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }
  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
  declare type LabelValueOptions = {
    label: string;
    value?: any;
    [key: string]: string | number | boolean;
  }[];

  declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T;
  }

  declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null;
  declare type TargetContext = '_self' | '_blank';
  declare interface WheelEvent {
    path?: EventTarget[];
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;
  declare type DynamicProps<T> = {
    [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
  };

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}
