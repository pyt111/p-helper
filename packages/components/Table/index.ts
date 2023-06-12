import { withInstall } from '@p-helper/utils';
import basicTable from './src/BasicTable.vue';
export * from './src/types/table';
export * from './src/types/tableAction';

export * from './src/hooks/useTable';
export const BasicTable = withInstall(basicTable);
