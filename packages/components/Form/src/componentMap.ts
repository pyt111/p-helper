import {
  ElInput,
  ElSelectV2,
  ElRadio,
  ElCheckbox,
  ElTreeSelect,
  // ElAutoComplete,
  ElCascader,
  ElDatePicker,
  ElInputNumber,
  ElSwitch,
  ElTimePicker,
  // ElTreeSelect,
  ElSlider,
  ElRate,
  ElDivider,
  ElColorPicker,
} from 'element-plus';
import { BasicUpload } from '@p-helper/components/Upload';
import FormRadioGroup from '@p-helper/components/Form/src/components/FormRadioGroup.vue';
import type { Component } from 'vue';
import type { ComponentType } from './types';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', ElInput);
componentMap.set('ColorPicker', ElColorPicker);
componentMap.set('InputNumber', ElInputNumber);

componentMap.set('Select', ElSelectV2);
componentMap.set('TreeSelect', ElTreeSelect);
componentMap.set('Switch', ElSwitch);
componentMap.set('Radio', ElRadio);
componentMap.set('RadioGroup', FormRadioGroup);
componentMap.set('Checkbox', ElCheckbox);
componentMap.set('Cascader', ElCascader);
componentMap.set('Slider', ElSlider);
componentMap.set('Rate', ElRate);

componentMap.set('DatePicker', ElDatePicker);
componentMap.set('TimePicker', ElTimePicker);

componentMap.set('Divider', ElDivider);
componentMap.set('Upload', BasicUpload);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
