import type { BasicIconProps } from '../../Icon/src/props';
import type { ExtractPropTypes, PropType } from 'vue';
export const buttonProps = {
  colorClassName: {
    type: String,
    validator: (v) => ['error', 'warning', 'success', ''].includes(v),
  },
  color: {
    type: String,
  },
  loading: { type: Boolean },
  link: { type: Boolean },
  label: { type: String },
  disabled: { type: Boolean },
  // 支持element-plus的图标与Icon组件
  preIcon: { type: [String, Object] },
  preIconProps: { type: Object as PropType<Partial<BasicIconProps>> },
  // 支持element-plus的图标与Icon组件
  suffixIcon: { type: [String, Object] },
  suffixIconProps: { type: Object as PropType<Partial<BasicIconProps>> },
  // 按钮图标 只支持使用svg图片的name, 如code|svg, 传给Icon组件
  icon: { type: [String] },
  // element-plus图标 传给BasicButton最外层的el-button使用的
  elIcon: { type: [String, Object] },
  iconSize: { type: [Number, String] as PropType<string | number> },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};

export const iconProps = {
  order: {
    type: String as PropType<'pre' | 'suffix'>,
  },
  // 支持element-plus的图标与Icon组件
  icon: {
    type: [String, Object] as PropType<string | object>,
  },
  // iconProps: {
  //   type: Object as PropType<Partial<BasicIconProps>>,
  // },
  iconSize: { type: [Number, String] as PropType<string | number> },
  color: {
    type: String,
  },
};
export type BasicButtonProps = ExtractPropTypes<typeof buttonProps>;
