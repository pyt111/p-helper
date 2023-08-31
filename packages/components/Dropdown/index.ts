import { withInstall } from '@p-helper/utils';
import dropdown from './src/Dropdown.vue';
import dropdownItemContent from './src/DropdownItemContent';

export * from './src/typing';
export const Dropdown = withInstall(dropdown);
export const DropdownItemContent = withInstall(dropdownItemContent);
