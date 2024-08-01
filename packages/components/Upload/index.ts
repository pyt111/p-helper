import { withInstall } from '@p-helper/utils';
import basicUpload from './src/BasicUpload.vue';

export * from './src/props';

export const BasicUpload = withInstall(basicUpload);
