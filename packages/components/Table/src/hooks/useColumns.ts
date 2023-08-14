import { computed, h, ref, shallowRef, toRaw, unref, watch } from 'vue';
import { isArray, isBoolean, isFunction, isNumber } from '@p-helper/utils/is';
import { cloneDeep, omit } from 'lodash-es';
import { renderEditCell } from '../components/editable';
import { ACTION_COLUMN_FLAG, INDEX_COLUMN_FLAG, ROW_KEY } from '../const';
import TableAction from '../components/TableAction.vue';
import type { EditRowRecordRow } from '../components/editable';
import type {
  BasicColumn,
  BasicTableProps,
} from '@p-helper/components/Table/src/types/table';
import type { ComputedRef, Ref } from 'vue';

export type EditRowKey = string | number | (string | number)[];

export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
  { getRowKey, getDataSource, getRowDataByRowIndex, findTableDataRecord }
) {
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

  // 缓存当前行编辑状态，便于外部获取
  const cacheEditRows = shallowRef({});

  const updateIndex = ref(0);
  const onCacheEditRows = (keys: (string | number)[], isEdit = true) => {
    keys.forEach((key) => {
      cacheEditRows.value[key] = isEdit;
    });
  };

  const getEditRows = () => {
    const result: BasicColumn[] = [];

    const stack = getViewColumns.value.slice(); // 复制数组以避免修改原数组

    while (stack.length > 0) {
      const item = stack.pop();

      if (item && item.editRow) {
        result.push(item);
      }

      if (item && item.children && item.children.length) {
        stack.push(...item.children);
      }
    }

    return result;
  };

  const findRowKeys = (k: EditRowKey, isIndex = false) => {
    const keys = isArray(k) ? k : [k];
    return keys.map((key) => {
      if (isNumber(key) && isIndex) {
        const rowData = getRowDataByRowIndex(key);
        return rowData[0]?.[getRowKey.value] ?? rowData[0]?.[ROW_KEY];
      }
      return key;
    });
  };

  const getIsRowEditCacheRowKeys = () => {
    return Object.entries(cacheEditRows.value)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  };

  // 某些情况下需要手动调用updateUi去激活computed
  const updateTableActionUi = () => {
    updateIndex.value += 1;
  };
  const getEditRowRecord = (): EditRowRecordRow => {
    return {
      rowKeyName: getRowKey.value,
      updateIndex,
      updateTableActionUi,
      cacheEditRows,
      getIsRowEditCacheRowKeys,
      onEditRow: (key: EditRowKey, isIndex?: boolean) => {
        const keys = findRowKeys(key, isIndex);
        onCacheEditRows(keys);
        getEditRows().forEach((item) => {
          item.record?.onEditRow?.(keys, isIndex);
        });
        updateTableActionUi();
      },
      onEditRowSave: (key: EditRowKey, isIndex?: boolean) => {
        const keys = findRowKeys(key, isIndex);
        onCacheEditRows(keys, false);
        getEditRows().forEach((item) => {
          item.record?.onEditRowSave?.(keys, isIndex);
        });
        updateTableActionUi();
      },
      onEditRowCancel: (key: EditRowKey, isIndex?: boolean) => {
        const keys = findRowKeys(key, isIndex);
        onCacheEditRows(keys, false);
        getEditRows().forEach((item) => {
          item.record?.onEditRowCancel?.(keys, isIndex);
        });
        updateTableActionUi();
      },
    };
  };

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
    // renderEditCell(actionColumn);
    if (hasIndex === -1) {
      // @ts-ignore
      columns.push({
        ...columns[hasIndex],
        fixed: 'right',
        // customRender: renderEditCell(actionColumn),
        customRender: ({ row, index, record: rec, elColumn }) => {
          const record = Object.assign(getEditRowRecord(), rec);
          let _dropDownActions = dropDownActions;
          if (isFunction(dropDownActions)) {
            _dropDownActions = dropDownActions({
              row,
              index,
              elColumn,
              record,
            });
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
        // 设置一些全局默认属性
        Object.assign(item, {
          align: propsRef.value.columnDefaultAlign || item.align,
        });
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

  // 处理column
  const doCreateColumn = (column: BasicColumn) => {
    const stack = [column];

    while (stack.length > 0) {
      const currentColumn = stack.pop()!;

      const { edit, editRow, flag, children, align } = currentColumn;
      const isDefaultAction = [INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(
        flag!
      );

      if (children && children.length) {
        for (const childColumn of children) {
          stack.push(childColumn);
        }
      }

      if ((edit || editRow) && !isDefaultAction) {
        if (!currentColumn.record) {
          currentColumn.record = {
            rowKeyName: getRowKey.value,
            cacheEditRows,
            getIsRowEditCacheRowKeys,
          };
        }
        currentColumn.customRender = renderEditCell(currentColumn, propsRef);
      }
    }
  };

  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef);

    const columns = cloneDeep(viewColumns);

    return columns
      .filter((column) => {
        return isIfShow(column);
      })
      .map((column) => {
        doCreateColumn(column);
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
    getEditRowRecord,
    cacheEditRows,
  };
}
