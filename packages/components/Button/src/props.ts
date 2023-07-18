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
  preIcon: { type: String },
  postIcon: { type: String },
  elIcon: { type: [String, Object] },
  Icon: { type: [String, Object] },
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};
