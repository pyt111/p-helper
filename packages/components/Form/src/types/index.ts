import type { Component, VNodeProps } from 'vue';
import type {
  UploadFileListProps,
  UploadPreviewProps,
} from '@p-helper/components';
import type { FileItem } from '@p-helper/components/Upload/src/typing';

type ColSpanType = number | string;
export interface ColEx {
  style?: any;
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}

export type ComponentType = keyof ComponentProps;

type MethodsNameToCamelCase<
  T extends string,
  M extends string = ''
> = T extends `${infer F}-${infer N}${infer Tail}`
  ? MethodsNameToCamelCase<Tail, `${M}${F}${Uppercase<N>}`>
  : `${M}${T}`;

type MethodsNameTransform<T> = {
  [K in keyof T as K extends `on${string}`
    ? MethodsNameToCamelCase<K>
    : never]: T[K];
};

type ExtractPropTypes<T extends Component> = T extends new (...args: any) => any
  ? Omit<InstanceType<T>['$props'], keyof VNodeProps>
  : never;

interface _CustomComponents {
  RadioGroup: ExtractPropTypes<
    typeof import('../components/RadioGroup.vue')['default']
  >;
  RadioButtonGroup: ExtractPropTypes<
    typeof import('../components/RadioButtonGroup.vue')['default']
  >;
  Upload: ExtractPropTypes<
    typeof import('@p-helper/components/Upload/src/BasicUpload.vue')['default']
  > & {
    fileListProps?: Partial<UploadFileListProps>;
    previewProps?: Partial<UploadPreviewProps>;
    onChange?: (urls: string[], fileList: FileItem[]) => void;
  };
}

type CustomComponents<T = _CustomComponents> = {
  [K in keyof T]: T[K] & MethodsNameTransform<T[K]>;
};

export interface ComponentProps {
  Input: ExtractPropTypes<
    typeof import('element-plus/es/components/input')['default']
  > &
    Partial<
      HTMLTextAreaElement & {
        onChange: ((...args: any[]) => any) | undefined;
        maxlength: string | number;
        minlength: string | number;
        max: string | number;
        min: string | number;
      }
    >;
  ColorPicker: ExtractPropTypes<
    typeof import('element-plus/es/components/color-picker')['default']
  >;
  InputNumber: ExtractPropTypes<
    typeof import('element-plus/es/components/input-number')['default']
  >;
  Select: ExtractPropTypes<
    typeof import('element-plus/es/components/select-v2')['default']
  >;
  TreeSelect: ExtractPropTypes<
    typeof import('element-plus/es/components/tree-select')['default']
  >;
  Switch: ExtractPropTypes<
    typeof import('element-plus/es/components/switch')['default']
  >;
  Radio: ExtractPropTypes<
    typeof import('element-plus/es/components/radio')['default']
  >;
  RadioGroup: ExtractPropTypes<
    typeof import('element-plus/es/components/radio')['ElRadioGroup']
  > &
    CustomComponents['RadioGroup'];
  RadioButtonGroup: CustomComponents['RadioButtonGroup'] &
    ComponentProps['RadioGroup'];
  Checkbox: ExtractPropTypes<
    typeof import('element-plus/es/components/checkbox')['default']
  >;
  Cascader: ExtractPropTypes<
    typeof import('element-plus/es/components/cascader')['default']
  >;
  Slider: ExtractPropTypes<
    typeof import('element-plus/es/components/slider')['default']
  >;
  Rate: ExtractPropTypes<
    typeof import('element-plus/es/components/rate')['default']
  >;
  DatePicker: ExtractPropTypes<
    typeof import('element-plus/es/components/date-picker')['default']
  >;
  TimePicker: ExtractPropTypes<
    typeof import('element-plus/es/components/time-picker')['default']
  >;
  Divider: ExtractPropTypes<
    typeof import('element-plus/es/components/divider')['default']
  >;
  Upload: CustomComponents['Upload'];
}
