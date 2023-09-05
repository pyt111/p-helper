import { withInstall } from '@p-helper/utils';
import basicTable from './src/BasicTable.vue';
import { TableIconCell, TableTooltipHeader } from './src/components';

export * from './src/types/table';
export * from './src/types/tableAction';
export * from './src/hooks/useTable';
export * from './src/components';

export const BasicTable = withInstall(basicTable, {
  TableTooltipHeader,
  TableIconCell,
});

