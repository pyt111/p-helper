import { computed, h, ref, toRaw, unref, watch } from 'vue';
import { isBoolean, isFunction } from '@p-helper/utils/is';
import { cloneDeep, omit } from 'lodash-es';
import { ElTableColumn } from 'element-plus';
import { renderEditCell } from '../components/editable';
import { ACTION_COLUMN_FLAG, INDEX_COLUMN_FLAG } from '../const';
import TableAction from '../components/TableAction.vue';
import type {
  BasicColumn,
  BasicTableProps,
} from '@p-helper/components/Table/src/types/table';
import type { ComputedRef, Ref } from 'vue';

function handleActionColumn(
  propsRef: ComputedRef<BasicTableProps>,
  columns: BasicColumn[]
) {
  const { actionColumn, actions, dropDownActions, dropDownButtonText } =
    unref(propsRef);
  if (!actionColumn) return;

  const hasIndex = columns.findIndex(
    (column) => column.flag === ACTION_COLUMN_FLAG
  );
  if (hasIndex === -1) {
    columns.push({
      ...columns[hasIndex],
      fixed: 'right',
      customRender: ({ row, index, record, elColumn }) => {
        let _dropDownActions = dropDownActions;
        if (isFunction(dropDownActions)) {
          _dropDownActions = dropDownActions({ row, index, elColumn, record });
        }
        let _actions = actions;
        if (isFunction(actions)) {
          _actions = actions({ row, index, elColumn, record });
        }
        let _dropDownButtonText = dropDownButtonText;
        if (isFunction(dropDownButtonText)) {
          _dropDownButtonText = dropDownButtonText({
            row,
            index,
            elColumn,
            record,
          });
        }
        return h(TableAction as any, {
          actions: _actions,
          dropDownActions: _dropDownActions,
          dropDownButtonText: _dropDownButtonText,
          row,
          index,
          record,
        });
      },
      ...actionColumn,
      flag: ACTION_COLUMN_FLAG,
    });
  }
}

// 生成多级表头的虚拟节点
const handleItem = (column: BasicColumn, propsRef) => {
  const prop = omit(column, ['children']);
  return h(ElTableColumn, prop, {
    default: () => column.children?.map((item) => handleItem(item, propsRef)),
  });
};

export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<
    BasicColumn[]
  >;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));

    if (!columns) {
      return [];
    }
    return columns;
  });

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns;
      handleActionColumn(propsRef, columnsRef.value);
      columns.forEach((item, i) => {
        if (item.type && ['index', 'selection', 'expand'].includes(item.type)) {
          item.showOverflowTooltip = false;

          if (item.type === 'index') {
            item.width = item.width ?? 60;
          }
        }
        if (!item.children) return;
        item.multiColumnVNode = handleItem(item, propsRef);
        // 这里去掉children 是为了element-plus警告
        columns[i] = omit(item, 'children');
      });
    }
  );

  function isIfShow(column: BasicColumn): boolean {
    const ifShow = column.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column);
    }
    return isIfShow;
  }

  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef);

    const columns = cloneDeep(viewColumns);

    return columns
      .filter((column) => {
        return isIfShow(column);
      })
      .map((column) => {
        const { edit, editRow, flag } = column;

        const isDefaultAction = [
          INDEX_COLUMN_FLAG,
          ACTION_COLUMN_FLAG,
        ].includes(flag!);

        // 编辑单元
        if ((edit || editRow) && !isDefaultAction) {
          if (!column.record) {
            column.record = {};
          }
          column.customRender = renderEditCell(column);
        }
        return column;
      });
  });

  function getColumns() {
    return toRaw(unref(getColumnsRef));
  }

  return {
    getColumnsRef,
    getViewColumns,
    getColumns,
  };
}
