import { iconProps } from '@p-helper/components/Icon';
import { basicCustomCellProps } from '../CustomCellComponent';
import type { TableCustomCellParams } from '../../../props';
import type { ExtractPropTypes, PropType } from 'vue';

export const iconCellProps = {
  ...iconProps,
  ...basicCustomCellProps,
  componentProps: {
    type: Object as PropType<{
      icon: string | ((obj: TableCustomCellParams) => any);
      suffixIcon: string | ((obj: TableCustomCellParams) => string);
      label: string;
    }>,
  },
};

export type IconCellProps = ExtractPropTypes<typeof iconCellProps>;
