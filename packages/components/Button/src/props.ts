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
  preIcon: { type: [String, Object] },
  suffixIcon: { type: [String, Object] },
  // 按钮图标 只支持使用svg图片的name
  icon: { type: [String] },
  // element-plus图标
  elIcon: { type: [String, Object] },
  iconSize: { type: [Number, String] as PropType<string | number> },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};

export const iconProps = {
  name: {
    type: String as PropType<'pre' | 'suffix'>,
  },
  icon: {
    type: [String, Object] as PropType<string | object>,
  },
  iconSize: { type: [Number, String] as PropType<string | number> },
  color: {
    type: String,
  },
};
export type BasicButtonProps = ExtractPropTypes<typeof buttonProps>;
