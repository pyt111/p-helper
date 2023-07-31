import type { ComponentType } from '../../types/componentType';

enum PlaceholderEnum {
  inputText = '请输入',
  chooseText = '请选择',
}

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input')) {
    return PlaceholderEnum.inputText;
  }
  if (component.includes('Picker')) {
    return PlaceholderEnum.chooseText;
  }

  if (
    component.includes('Select') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('RadioGroup') ||
    component.includes('Switch') ||
    component.includes('DatePicker') ||
    component.includes('TimePicker')
  ) {
    return PlaceholderEnum.chooseText;
  }
  return '';
}
