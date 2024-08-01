import { propTypes } from '@p-helper/utils/propTypes';
import type { ExtractPropTypes, PropType } from 'vue';

export const iconProps = {
  // icon name
  icon: propTypes.string,
  // icon color
  // svg 有feColorMatrix滤镜的地方 不生效
  color: propTypes.string,
  disabled: propTypes.bool.def(undefined),
  // icon size
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 16,
  },
  spin: propTypes.bool.def(false),
  prefix: propTypes.string.def(''),
};

export type BasicIconProps = ExtractPropTypes<typeof iconProps>;
