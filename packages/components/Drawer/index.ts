import { withInstall } from '@p-helper/utils';
import basicDrawer from './src/BasicDrawer.vue';

export const BasicDrawer = withInstall(basicDrawer);
export * from './src/typing';
export * from './src/props';
export { useDrawer, useDrawerInner } from './src/useDrawer';
