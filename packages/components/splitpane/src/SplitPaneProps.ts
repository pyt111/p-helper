import type { ExtractPropTypes, PropType } from 'vue';

type Direction = 'horizontal' | 'vertical';

export const splitPaneProps = {
  direction: {
    type: String as PropType<Direction>,
    default: 'horizontal',
  },
};

export type SplitPanePropsTypes = ExtractPropTypes<typeof splitPaneProps>;
