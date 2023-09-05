import { withInstall } from '@p-helper/utils';
import basicTable from './src/BasicTable.vue';
import tableIconCell from './src/components/custom/IconCell/IconCell.vue';
import tooltipHeader from './src/components/custom/header/TooltipHeader.vue';
export * from './src/types/table';
export * from './src/types/tableAction';

export * from './src/hooks/useTable';
export * from './src/components';

export const BasicTable = withInstall(basicTable);

export const TableIconCell = withInstall(tableIconCell);
export const TooltipHeader = withInstall(tooltipHeader);
