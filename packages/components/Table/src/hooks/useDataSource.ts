import {
  computed,
  onMounted,
  reactive,
  ref,
  unref,
  watch,
  watchEffect,
} from 'vue';
import { useTimeoutFn } from '@p-helper/hooks/core/useTimeout';
import { buildUUID } from '@p-helper/utils/uuid';
import { isArray, isBoolean, isFunction, isString } from '@p-helper/utils/is';
import { cloneDeep, get, merge } from 'lodash-es';
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../const';
import type { EditRecordRow } from '../components/editable';
import type { PaginationProps } from '../types/pagination';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps, FetchParams } from '../types/table';

interface ActionType {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  getFieldsValue: () => Recordable;
  clearSelectedRowKeys?: () => void;
  tableData: Ref<Recordable[]>;
}

interface SearchState {
  sortInfo: Recordable;
  filterInfo: Record<string, string[]>;
}
export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  {
    getPaginationInfo,
    setPagination,
    setLoading,
    getFieldsValue,
    clearSelectedRowKeys,
    tableData,
  }: ActionType,
  emit: EmitType
) {
  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });
  const dataSourceRef = ref<Recordable[]>([]);
  const rawDataSourceRef = ref<Recordable>({});
  const recordCache = reactive<Partial<EditRecordRow> & Record<string, any>>(
    {}
  );

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
    dataSourceRef.value.forEach((item) => {
      const targetKeyName = getTargetKeyName(item);
      if (item[targetKeyName]) {
        recordCache[item[targetKeyName]] = Object.assign(
          { ...item },
          recordCache[item[targetKeyName]] || {}
        );
      }
    });
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, api } = unref(propsRef);
      !api && dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  function onOfflinePaging() {
    const { currentPage = 1, pageSize = PAGE_SIZE } = unref(
      getPaginationInfo
    ) as PaginationProps;

    return unref(dataSourceRef).filter(
      (_item, index) =>
        index >= (currentPage - 1) * pageSize && index < currentPage * pageSize
    );
  }

  function handleTableChange(
    pagination: PaginationProps,
    filters: Partial<Recordable<string[]>>,
    sorter: any
  ) {
    const { clearSelectOnPageChange, sortFn, filterFn } = unref(propsRef);
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys?.();
    }
    setPagination(pagination);

    const params: Recordable = {};
    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }
    fetch(params);
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  }

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getTargetKeyName = (row: Recordable) => {
    const rowKeyName = unref(getRowKey);
    let targetKeyName = rowKeyName;
    if (isFunction(rowKeyName)) {
      targetKeyName = rowKeyName(row);
    }
    return targetKeyName as string;
  };

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = cloneDeep(unref(dataSourceRef));
          data.forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID();
            }
            if (item.children && item.children.length) {
              setTableKey(item.children);
            }
          });
          dataSourceRef.value = data;
        }
      }
    }
    if (propsRef.value.offlinePaging) {
      // 前端 分页
      return onOfflinePaging();
    }
    return unref(dataSourceRef);
  });

  async function updateTableData(index: number, key: string, value: any) {
    const record = dataSourceRef.value[index];
    if (record) {
      dataSourceRef.value[index][key] = value;
    }
    return dataSourceRef.value[index];
  }

  function updateTableDataRecord(
    rowKey: string | number,
    record: Recordable
  ): Recordable | undefined {
    const row = findTableDataRecord(rowKey);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      return row;
    }
  }

  function deleteTableDataRecord(
    rowKey: string | number | string[] | number[]
  ) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    const rowKeyName = unref(getRowKey);
    if (!rowKeyName) return;
    const rowKeys = !Array.isArray(rowKey) ? [rowKey] : rowKey;

    function deleteRow(data, key) {
      const row: { index: number; data: [] } = findRow(data, key);
      if (row === null || row.index === -1) {
        return;
      }
      row.data.splice(row.index, 1);

      function findRow(data, key) {
        if (data === null || data === undefined) {
          return null;
        }
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          let targetKeyName: string = rowKeyName as string;
          if (isFunction(rowKeyName)) {
            // @ts-ignore
            targetKeyName = rowKeyName(row);
          }
          if (row[targetKeyName] === key || row[ROW_KEY] === key) {
            return { index: i, data };
          }
          if (row.children?.length > 0) {
            const result = findRow(row.children, key);
            if (result != null) {
              return result;
            }
          }
        }
        return null;
      }
    }
    for (const key of rowKeys) {
      deleteRow(dataSourceRef.value, key);
      deleteRow(unref(propsRef).dataSource, key);
    }
    setPagination({
      pageCount: unref(propsRef).dataSource?.length,
    });
  }

  function insertTableDataRecord(
    record: Recordable,
    index?: number
  ): Recordable | void {
    // if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    let rowKeyName = unref(getRowKey);

    if (isFunction(rowKeyName)) {
      rowKeyName = rowKeyName(record);
    }
    if (!record[rowKeyName]) {
      setTableKey([record]);
    }
    index = index ?? dataSourceRef.value?.length;
    unref(dataSourceRef).splice(index, 0, record);
    return unref(dataSourceRef);
  }

  function findTableDataRecord(rowKey: string | number) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;

    const rowKeyName = unref(getRowKey);
    if (!rowKeyName) return;

    const { childrenColumnName = 'children' } = unref(propsRef);

    const findRow = (array: any[]) => {
      let ret;
      array.some(function iter(r) {
        if (typeof rowKeyName === 'function') {
          if ((rowKeyName(r) as string) === rowKey) {
            ret = r;
            return true;
          }
        } else {
          if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
            ret = r;
            return true;
          }
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter);
      });
      return ret;
    };

    // const row = dataSourceRef.value.find(r => {
    //   if (typeof rowKeyName === 'function') {
    //     return (rowKeyName(r) as string) === rowKey
    //   } else {
    //     return Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey
    //   }
    // })
    return findRow(dataSourceRef.value);
  }

  async function fetch(opt?: FetchParams) {
    const { api, searchInfo, defSort, beforeFetch, afterFetch, useSearchForm } =
      unref(propsRef);
    if (!api || !isFunction(api)) return;
    try {
      setLoading(propsRef.value.tableLoading);
      const { listField, totalField, sizeField, pageField } = getFetchSetting();

      const { sortInfo = {}, filterInfo } = searchState;

      const pageParams = getPageParams(opt);

      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        searchInfo,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {}
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        // @ts-ignore
        params = (await beforeFetch(params)) || params;
      }

      const res = await api(params);
      rawDataSourceRef.value = res.data;
      const rowData = res.data;
      const isArrayResult = Array.isArray(rowData);

      let resultItems: Recordable[] = isArrayResult
        ? rowData
        : get(rowData, listField);
      const resultTotal: number = isArrayResult
        ? rowData.length
        : get(rowData, totalField);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (resultTotal) {
        const currentTotalPage = Math.ceil(resultTotal / pageParams[sizeField]);
        if (pageParams[pageField] > currentTotalPage) {
          setPagination({
            currentPage: currentTotalPage,
          });
          return await fetch(opt);
        }
      }

      if (afterFetch && isFunction(afterFetch)) {
        // @ts-ignore
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          currentPage: opt.page || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      });
      return resultItems;
    } catch (error) {
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function getFetchSetting() {
    const { fetchSetting } = unref(propsRef);
    return Object.assign({}, FETCH_SETTING, fetchSetting);
  }

  function getPageParams(opt?: FetchParams) {
    const { pagination, offlinePaging } = unref(propsRef);
    const { pageField, sizeField } = getFetchSetting();
    let pageParams: Recordable = {};

    const { currentPage = 1, pageSize = PAGE_SIZE } = unref(
      getPaginationInfo
    ) as PaginationProps;

    if (
      (isBoolean(pagination) && !pagination) ||
      isBoolean(getPaginationInfo)
    ) {
      pageParams = {};
    } else {
      pageParams[pageField] = (opt && opt.page) || currentPage;
      pageParams[sizeField] = offlinePaging ? undefined : pageSize;
    }
    return pageParams;
  }

  function setTableData<T extends Recordable>(values: T[]) {
    dataSourceRef.value = values;
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  /**
   * 根据行下标获取数据
   * @param rowIndex
   */
  function getRowDataByRowIndex<T = Recordable>(
    rowIndex: number[] | number
  ): Recordable[] {
    const indexes = isArray(rowIndex) ? rowIndex : [rowIndex];
    return getDataSource().filter((item, index) => indexes.includes(index));
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T;
  }

  async function reload(opt?: FetchParams) {
    return fetch(opt);
  }

  function getCellRecord(row: Recordable | string) {
    if (isString(row)) {
      return recordCache[row];
    }
    const targetKeyName = getTargetKeyName(row);
    return recordCache[targetKeyName];
  }

  function getRowKeyName() {
    return getRowKey.value;
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {
    getDataSourceRef,
    getRowDataByRowIndex,
    getDataSource,
    getRawDataSource,
    getRowKey,
    setTableData,
    getAutoCreateKey,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleTableChange,
    recordCache,
    getCellRecord,
    getRowKeyName,
  };
}
