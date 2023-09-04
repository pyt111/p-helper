import { basicCustomCellProps } from '../CustomCellComponent';
import type { BadgeProps } from 'element-plus';
import type { ExtractPropTypes, PropType } from 'vue';
import type { ActionItem } from '@p-helper/components/Table/src/types/tableAction';

export const badgeActionProps = {
  ...basicCustomCellProps,
  componentProps: {
    type: Object as PropType<
      ActionItem & {
        badge?: Partial<BadgeProps>;
      }
    >,
  },
};

export type BadgeActionProps = ExtractPropTypes<typeof badgeActionProps>;
