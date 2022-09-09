import { withInstall } from '@p-helper/utils';

import Waterfall from './src/Waterfall.vue';

export const PWaterfall = withInstall(Waterfall);

export default PWaterfall;

export * from './src/waterfall';
export * from './src/useWaterfall';
export * from './types';
