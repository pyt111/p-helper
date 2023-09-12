import { computed, h, ref, shallowRef, toRaw, unref, watch } from 'vue';
import { isArray, isBoolean, isFunction, isNumber } from '@p-helper/utils/is';
import { cloneDeep } from 'lodash-es';
import componentSetting from '@p-helper/constants/settings/componentSetting';
import { renderEditCell } from '../components/editable';
import {
  ACTION_COLUMN_FLAG,
  INDEX_COLUMN_FLAG,
  PAGE_SIZE,
  ROW_KEY,
} from '../const';
import TableAction from '../components/TableAction.vue';
import type { usePagination } from './usePagination';
import type { PaginationProps } from '../types/pagination';
import type { useDataSource } from './useDataSource';
import type {
  BasicColumn,
  BasicTableProps,
  TypeOrReturnTypeFun,
} from '@p-helper/components/Table/src/types/table';
import type { TableActionParams } from '../components/editable';
import type { ActionItem } from '../types/tableAction';
import type { ComputedRef, Ref } from 'vue';

export type EditRowKey = string | number | (string | number)[];

export type useColumnsOptions = {
  getRowKey: Ref<string>;
  getDataSource: ReturnType<typeof useDataSource>['getDataSource'];
  getRowDataByRowIndex: ReturnType<
    typeof useDataSource
  >['getRowDataByRowIndex'];
  findTableDataRecord: ReturnType<typeof useDataSource>['findTableDataRecord'];
  getPaginationInfo: ReturnType<typeof usePagination>['getPaginationInfo'];
};

// 这里为了生成默认的操作列，并做一些处理
const convertParamsTool = <T>(
  acs: TypeOrReturnTypeFun<T>,
  params: TableActionParams
) => {
  if (!acs) return acs;
  return isFunction(acs) ? acs(params) : acs;
};

const handelIndexColumn = (
  propsRef: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<boolean | PaginationProps>,
  columns: BasicColumn[]
) => {
  const indColumn = columns.find((column) => column.type === 'index');
  if (!indColumn) return;
  if (indColumn.totalIndex) {
    const getPagination = unref(getPaginationRef);

    const index =
      indColumn.index ??
      ((i) => {
        if (isBoolean(getPagination)) {
          return `${i + 1}`;
        }
        const { currentPage = 1, pageSize = PAGE_SIZE } = getPagination;
        return ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + i + 1;
      });
    Object.assign(indColumn, {
      index,
    });
  }
};
export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
  { getRowKey, getRowDataByRowIndex, getPaginationInfo }: useColumnsOptions
) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<
    BasicColumn[]
  >;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));

    if (!columns) {
      return [];
    }

    handelIndexColumn(propsRef, getPaginationInfo, columns);
    handleActionColumn(propsRef, columns);
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
  function getEditRowRecord(rows?: Recordable[]) {
    const defaultKeys =
      rows?.map((item) => item[getRowKey.value] ?? item[ROW_KEY]) || [];
    return {
      rowKeyName: getRowKey.value,
      updateIndex,
      updateTableActionUi,
      cacheEditRows,
      getIsRowEditCacheRowKeys,
      isEditableRow() {
        return defaultKeys.some((k) => cacheEditRows.value[k]);
      },
      onEditRow(key?: EditRowKey, isIndex?: boolean) {
        const keys = key ? findRowKeys(key, isIndex) : defaultKeys;
        onCacheEditRows(keys);
        getEditRows().forEach((item) => {
          item.record?.onEditRow?.(keys, isIndex);
        });
        updateTableActionUi();
      },
      onEditRowSave(key?: EditRowKey, isIndex?: boolean) {
        const keys = key ? findRowKeys(key, isIndex) : defaultKeys;
        onCacheEditRows(keys, false);
        getEditRows().forEach((item) => {
          item.record?.onEditRowSave?.(keys, isIndex);
        });
        updateTableActionUi();
      },
      onEditRowCancel(key?: EditRowKey, isIndex?: boolean) {
        const keys = key ? findRowKeys(key, isIndex) : defaultKeys;
        onCacheEditRows(keys, false);
        getEditRows().forEach((item) => {
          item.record?.onEditRowCancel?.(keys, isIndex);
        });
        updateTableActionUi();
      },
    };
  }

  // actionColumn.editRow=true 时，需要用到这个生成编辑行开启默认操作列
  const genEditRowDefaultActions = (): ActionItem[] => [
    {
      label: '编辑',
      buttonName: 'edit',
      ifShow: (action, { record }) => {
        return !record.isEditableRow();
      },
      onClick: (obj) => {
        const { record } = obj;
        record.onEditRow();
      },
    },
    {
      label: '保存',
      buttonName: 'save',
      ifShow: (action, { record }) => {
        return record.isEditableRow();
      },
      onClick: ({ record }) => {
        record.onEditRowSave();
      },
    },
    {
      label: '取消',
      buttonName: 'cancel',
      ifShow: (action, { record }) => {
        return record.isEditableRow();
      },
      onClick: ({ record }) => {
        record.onEditRowCancel();
      },
    },
  ];

  // 这里为了生成默认的操作列，并做一些处理
  const getEditRowActions = (params: TableActionParams) => {
    const { actionColumn } = unref(propsRef);
    const defaultActions: ActionItem[] = genEditRowDefaultActions();
    const _editRowButtonsProps = convertParamsTool(
      actionColumn.editButtonsProps,
      params
    );

    if (_editRowButtonsProps) {
      _editRowButtonsProps.forEach((item) => {
        const defaultAction = defaultActions.find(
          (action) => action.buttonName === item.buttonName
        );
        if (defaultAction) {
          Object.assign(defaultAction, item);
        }
      });
    }
    return {
      defaultActions,
    };
  };

  // 自动拆分操作列
  const getSplitAllActions = (params: TableActionParams) => {
    const { actionColumn, actions, dropDownActions } = unref(propsRef);
    const { allActions = [], showButtonsLength = 2 } = actionColumn;

    let _allActions = [...convertParamsTool(allActions, params)];
    const _actions = convertParamsTool(actions, params);
    const _dropDownActions = convertParamsTool(dropDownActions, params);

    const _showButtonsLength = convertParamsTool(showButtonsLength, params);
    let splitAllActions = _allActions.splice(
      0,
      actionColumn.editRow ? _showButtonsLength - 1 : _showButtonsLength
    );
    // 如果actions存在就放入展开的操作按钮排版中,优先级比allActions高
    if (_actions) {
      splitAllActions = [..._actions, ...splitAllActions];
    }
    // 开启行编辑时，自动添加编辑按钮 actionColumn.editRow不开启时，不添加编辑按钮
    if (actionColumn.editRow) {
      const defaultActions = getEditRowActions(params).defaultActions;
      splitAllActions = [...defaultActions, ...splitAllActions];
    }

    // 如果dropDownActions存在就放入下拉中,优先级比allActions高
    if (_dropDownActions) {
      _allActions = [..._dropDownActions, ..._allActions];
    }
    return {
      actions: splitAllActions,
      dropDownActions: _allActions,
    };
  };

  const getActions = (params: TableActionParams) => {
    const { actionColumn, actions, dropDownActions, dropDownButtonText } =
      unref(propsRef);
    const _dropDownActions = convertParamsTool(dropDownActions, params);
    let _actions = convertParamsTool(actions, params);
    // 开启行编辑时，自动添加编辑按钮 actionColumn.editRow不开启时，不添加编辑按钮
    if (actionColumn.editRow) {
      const defaultActions = getEditRowActions(params).defaultActions;
      _actions = [...defaultActions, ..._actions];
    }
    return {
      actions: _actions,
      dropDownActions: _dropDownActions,
    };
  };
  // 生成操作列
  function genActionsColumn({ row, index, record, elColumn }) {
    const { actionColumn, dropDownButtonText } = unref(propsRef);
    const params = { row, index, elColumn, record };

    const AC = actionColumn.allActions
      ? getSplitAllActions(params)
      : getActions(params);
    const actions: ActionItem[] = AC.actions;
    const dropDownActions = AC.dropDownActions;
    const _dropDownButtonText = convertParamsTool(dropDownButtonText, params);

    return h(TableAction as any, {
      actions,
      dropDownActions,
      dropDownButtonText: _dropDownButtonText,
      row,
      index,
      record,
    });
  }

  function handleActionColumn(
    propsRef: ComputedRef<BasicTableProps>,
    columns: BasicColumn[]
  ) {
    const { actionColumn } = unref(propsRef);
    if (!actionColumn) return;

    const hasIndex = columns.findIndex(
      (column) => column.flag === ACTION_COLUMN_FLAG
    );
    // renderEditCell(actionColumn);
    if (hasIndex === -1) {
      // @ts-ignore
      columns.push({
        align:
          actionColumn.align ??
          propsRef.value.columnDefaultAlign ??
          componentSetting.table.column.align,
        ...columns[hasIndex],
        fixed: 'right',
        // customRender: renderEditCell(actionColumn),
        customRender: ({ row, index, record: rec, elColumn }) => {
          const record = Object.assign(getEditRowRecord([row]), rec);
          return genActionsColumn({ row, index, record, elColumn });
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
      columns.forEach((item, i) => {
        if (item.type) {
          if (['index', 'selection', 'expand', 'setting'].includes(item.type)) {
            item.showOverflowTooltip = false;
          }

          if (['index', 'selection', 'expand'].includes(item.type)) {
            item.width = item.width ?? 60;
          }
        }
        // 设置一些全局默认属性
        Object.assign(item, {
          ...componentSetting.table.column,
          align:
            item.align ??
            propsRef.value.columnDefaultAlign ??
            componentSetting.table.column.align,
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
    // 创建一个栈，用于存放当前列
    const stack = [column];

    // 当栈长度为0时，表示当前列已经遍历完毕
    while (stack.length > 0) {
      // 获取当前列
      const currentColumn = stack.pop()!;

      // 获取当前列的编辑、编辑行、标志、子列、对齐方式
      const { edit, editRow, flag, children, align } = currentColumn;
      // 判断当前列是否为默认操作
      const isDefaultAction = [INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(
        flag!
      );

      // 如果子列存在，则遍历子列
      if (children && children.length) {
        for (const childColumn of children) {
          // 将子列添加到栈中
          stack.push(childColumn);
        }
      }

      // 如果当前列的编辑或编辑行存在，且不是默认操作，则渲染编辑单元格
      if ((edit || editRow) && !isDefaultAction) {
        // 如果当前列的记录不存在，则设置记录
        if (!currentColumn.record) {
          currentColumn.record = {
            rowKeyName: getRowKey.value,
            cacheEditRows,
            getIsRowEditCacheRowKeys,
          };
        }
        // 渲染编辑单元格
        currentColumn.customRender = renderEditCell(currentColumn, propsRef);
      }
    }
  };

  const getViewColumns = computed(() => {
    // 获取视图列
    const viewColumns = unref(getColumnsRef);

    // 克隆视图列
    const columns = cloneDeep(viewColumns);

    // 过滤出可见的列
    return columns
      .filter((column) => {
        return isIfShow(column);
      })
      .map((column) => {
        // 创建列
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
