export const buttonProps = {
  color: { type: String, validator: (v) => ['error', 'warning', 'success', ''].includes(v) },
  loading: { type: Boolean },
  link: { type: Boolean },
  label: { type: String },
  disabled: { type: Boolean },
  preIcon: { type: String },
  postIcon: { type: String },
  elIcon: { type: [String, Object] },
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};
