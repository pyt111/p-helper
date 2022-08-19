import type { ExtractPropTypes } from 'vue';
export const waterfallProps = {
  mode: {
    type: String,
    default: 'css' as 'css' | 'js',
  },
};
export type WaterfallProps = ExtractPropTypes<typeof waterfallProps>;
