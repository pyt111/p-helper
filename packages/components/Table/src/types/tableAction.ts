import type { BasicButtonProps } from '../../../Button/src/props';
import type {
  Params,
  TableActionParams,
} from '@p-helper/components/Table/src/components/editable';
import type { CSSProperties, Component, ExtractPropTypes } from 'vue';
import type { ElTooltipProps } from 'element-plus/es/components/tooltip';
import type { ButtonProps } from 'element-plus/es/components/button';

export type ActionItem = Partial<
  ButtonProps &
    BasicButtonProps & {
      onClick?: (obj: TableActionParams) => void;
      label?: string;
      divided?: boolean;
      colorClassName?: 'success' | 'error' | 'warning' | 'danger';
      popConfirm?: PopConfirm;
      disabled?: boolean;
      divider?: boolean;
      // 权限编码控制是否显示
      auth?: string | string[];
      // 业务控制是否显示
      ifShow?:
        | boolean
        | ((action: ActionItem, emitParams: TableActionParams) => boolean);
      dynamicIfShow?:
        | boolean
        | ((action: ActionItem, emitParams: TableActionParams) => boolean);
      tooltip?: string | ElTooltipProps;
      buttonName?: 'edit' | 'save' | 'cancel';
    }
>;

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: (obj: Params) => void;
  cancel?: (obj: Params) => void;
  icon?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight';
}
