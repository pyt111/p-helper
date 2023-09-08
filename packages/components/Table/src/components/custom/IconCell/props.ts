import { iconProps } from '@p-helper/components/Icon';
import { basicCustomCellProps } from '../CustomCellComponent';
import type { BasicIconProps } from '../../../../../Icon/src/props';
import type { TextProps } from 'element-plus';
import type { TableCustomCellParams } from '../../../props';
import type { ExtractPropTypes, PropType } from 'vue';

export const iconCellProps = {
  ...iconProps,
  ...basicCustomCellProps,
  componentProps: {
    type: Object as PropType<{
      preIcon?: string | ((obj: TableCustomCellParams) => any);
      preIconProps?: Partial<BasicIconProps>;
      suffixIcon?: string | ((obj: TableCustomCellParams) => string);
      suffixIconProps?: Partial<BasicIconProps>;
      label: string;
      elText?: Partial<TextProps>;
    }>,
  },
};

export type IconCellProps = ExtractPropTypes<typeof iconCellProps>;
