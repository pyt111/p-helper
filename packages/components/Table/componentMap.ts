import {
  ElCheckbox,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElSelectV2,
  ElSwitch,
  ElTimePicker,
} from 'element-plus';
import type { Component } from 'vue';
import type { ComponentType } from './src/types/componentType';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', ElInput);
componentMap.set('InputNumber', ElInputNumber);
componentMap.set('Select', ElSelectV2);
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

export { componentMap };
