import type { ExtractPropTypes, PropType } from 'vue';

export const splitPaneItemProps = {
  splitterShow: {
    type: Boolean,
    default: true,
  },
  size: {
    type: [Number, String] as PropType<string | number | null>,
    default: null,
  },
  minSize: { type: [Number, String], default: 0 },
  maxSize: { type: [Number, String], default: 100 },
};

export type SplitPaneItemPropsTypes = ExtractPropTypes<
  typeof splitPaneItemProps
>;
