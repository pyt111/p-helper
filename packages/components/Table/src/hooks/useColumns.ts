import { computed, h, ref, shallowRef, toRaw, unref, watch } from 'vue';
import { isArray, isBoolean, isFunction, isNumber } from '@p-helper/utils/is';
import { cloneDeep, omit } from 'lodash-es';
import { ElTableColumn } from 'element-plus';
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
    return getViewColumns.value.filter((item) => !!item.editRow);
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

  // 生成多级表头的虚拟节点
  const handleItem = (column: BasicColumn, propsRef) => {
    const prop = omit(column, ['children']);
    return h(ElTableColumn, prop, {
      default: () => column.children?.map((item) => handleItem(item, propsRef)),
    });
  };
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

        if (!item.children) return;
        item.multiColumnVNode = handleItem(item, propsRef);
        // 这里去掉children 是为了element-plus警告
        // @ts-ignore
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
        const { edit, editRow, flag, align } = column;
        const isDefaultAction = [
          INDEX_COLUMN_FLAG,
          ACTION_COLUMN_FLAG,
        ].includes(flag!);

        // 编辑单元格
        if ((edit || editRow) && !isDefaultAction) {
          if (!column.record) {
            column.record = {
              rowKeyName: getRowKey.value,
              cacheEditRows,
              getIsRowEditCacheRowKeys,
            };
          }
          column.customRender = renderEditCell(column, propsRef);
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
    getEditRowRecord,
    cacheEditRows,
  };
}
