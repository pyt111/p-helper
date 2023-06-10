import type { Component, ExtractPropTypes } from 'vue';
import type { ElTooltipProps } from 'element-plus/es/components/tooltip';
import type { ButtonProps } from 'element-plus/es/components/button';
import type { Params } from '@p-helper/components/Table/src/components/editable';

export interface ActionItem extends ExtractPropTypes<ButtonProps> {
  onClick?: (obj: Params) => void;
  label?: string;
  divided?: boolean;
  color?: 'success' | 'error' | 'warning' | 'danger';
  icon?: string;
  elIcon?: string | Component;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem, emitParams: Params) => boolean);
  tooltip?: string | ElTooltipProps;
}

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
