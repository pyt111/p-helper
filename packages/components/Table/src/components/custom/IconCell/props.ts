import { iconProps } from '@p-helper/components/Icon';
import type { TableCustomCellParams } from '../../../props';
import type { PropType } from 'vue';

export const iconCellProps = {
  ...iconProps,
  icon: {
    type: [String, Function] as PropType<
      string | ((obj: TableCustomCellParams) => any)
    >,
    default: '',
  },
  suffixIcon: {
    type: [String, Function] as PropType<
      string | ((obj: TableCustomCellParams) => string)
    >,
    default: '',
  },
  cellText: {
    type: String,
    default: '',
  },
};
