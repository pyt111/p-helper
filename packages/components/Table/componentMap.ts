import {
  ElCheckbox,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElSelectV2,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
} from 'element-plus';
import { IconCell } from './src/components/custom';
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types';
import type {
  CheckboxProps,
  DatePickerProps,
  ISelectProps,
  InputNumberProps,
  InputProps,
  SwitchProps,
  TimePickerDefaultProps,
} from 'element-plus';
import type { Component, ExtractPropTypes, Ref } from 'vue';
import type {
  ComponentType,
  CustomComponentType,
} from './src/types/componentType';
import type { iconCellProps } from './src/components/custom/IconCell/props';
import type { SelectOptions } from '../Form';

export type ComponentPropsMapBasic = {
  Input: InputProps;
  InputNumber: InputNumberProps;
  Select: ISelectProps & {
    options:
      | (OptionType & SelectOptions)[]
      | Ref<(OptionType & SelectOptions)[]>;
  };
  Switch: SwitchProps;
  Checkbox: CheckboxProps;
  DatePicker: DatePickerProps;
  TimePicker: TimePickerDefaultProps;
  TableIconCell: ExtractPropTypes<typeof iconCellProps>;
};

export type ComponentPropsMap = {
  [K in keyof ComponentPropsMapBasic]: Partial<ComponentPropsMapBasic[K]>;
};

/*
 * @description: 自定义组件映射表 table组件单元格 编辑组件
 */
const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', ElInput);
componentMap.set('InputNumber', ElInputNumber);
componentMap.set('Select', ElSelectV2);
componentMap.set('TreeSelect', ElTreeSelect);
componentMap.set('Switch', ElSwitch);
componentMap.set('Checkbox', ElCheckbox);
componentMap.set('DatePicker', ElDatePicker);
componentMap.set('TimePicker', ElTimePicker);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

/*
 * @description: 自定义组件映射表 table组件单元格自定义组件
 */
const customComponentMap = new Map<CustomComponentType, Component>();

customComponentMap.set('TableIconCell', IconCell);

export { componentMap, customComponentMap };
