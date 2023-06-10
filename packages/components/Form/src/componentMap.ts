import {
  ElInput,
  ElSelectV2,
  ElRadio,
  ElCheckbox,
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
import FormRadioGroup from './components/FormRadioGroup.vue';
import type { Component } from 'vue';
import type { ComponentType } from './types';


const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', ElInput);
componentMap.set('ColorPicker', ElColorPicker);
// componentMap.set('InputGroup', Input.Group);
// componentMap.set('InputPassword', Input.Password);
// componentMap.set('InputSearch', Input.Search);
// componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', ElInputNumber);
// componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', ElSelectV2);
// componentMap.set('ApiSelect', ApiSelect);
// componentMap.set('ApiTree', ApiTree);
// componentMap.set('TreeSelect', TreeSelect);
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
// componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', ElSwitch);
// componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('Radio', ElRadio);
componentMap.set('RadioGroup', FormRadioGroup);
componentMap.set('Checkbox', ElCheckbox);
// componentMap.set('CheckboxGroup', Checkbox.Group);
// componentMap.set('ApiCascader', ApiCascader);
componentMap.set('Cascader', ElCascader);
componentMap.set('Slider', ElSlider);
componentMap.set('Rate', ElRate);

componentMap.set('DatePicker', ElDatePicker);
// componentMap.set('MonthPicker', DatePicker.MonthPicker);
// componentMap.set('RangePicker', DatePicker.RangePicker);
// componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', ElTimePicker);
// componentMap.set('StrengthMeter', StrengthMeter);
// componentMap.set('IconPicker', IconPicker);
// componentMap.set('InputCountDown', CountdownInput);

// componentMap.set('Upload', BasicUpload);
componentMap.set('Divider', ElDivider);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
