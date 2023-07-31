import { iconProps } from '@p-helper/components/Icon';

export const iconCellProps = {
  ...iconProps,
  suffixIcon: {
    type: String,
    default: '',
  },
  cellText: {
    type: String,
    default: '',
  },
};
