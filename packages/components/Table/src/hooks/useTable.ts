import { onUnmounted, ref, toRaw, unref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { getDynamicProps } from '@p-helper/utils';
import { error } from '@p-helper/utils/log';
import type { WatchStopHandle } from 'vue';
import type { FormActionType } from '@p-helper/components/Form';
import type {
  BasicTableProps,
  FetchParams,
  TableActionType,
} from '../types/table';
// import type { DynamicProps } from '#/utils';
import type { PaginationProps } from '../types/pagination';

type Props = Partial<DynamicProps<BasicTableProps>>;

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType;
};

export function useTable(
  tableProps?: Props
): [
  (instance: TableActionType, formInstance: UseTableMethod) => void,
  UseTableMethod
] {
  const tableRef = ref<Nullable<TableActionType>>(null);
  const formRef = ref<Nullable<UseTableMethod>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  let stopWatch: WatchStopHandle;

  function register(instance: TableActionType, formInstance: UseTableMethod) {
    onUnmounted(() => {
      tableRef.value = null;
      loadedRef.value = null;
    });

    if (unref(loadedRef) && instance === unref(tableRef)) return;

    tableRef.value = instance;
    formRef.value = formInstance;
    tableProps && instance.setProps(getDynamicProps(tableProps));
    loadedRef.value = true;

    stopWatch?.();

    stopWatch = debouncedWatch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        immediate: true,
        deep: true,
        debounce: 100,
      }
    );
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      error('表实例尚未获取，执行表操作时请确保表已呈现！');
    }
    return table as TableActionType;
  }

  const methods: UseTableMethod = {
    reload: (opt?: FetchParams) => {
      return getTableInstance().reload(opt);
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];
      return toRaw(columns);
    },
    renderPagination: () => {
      getTableInstance().renderPagination();
    },
    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    // refreshOfflineTableData: () => {
    //   getTableInstance().refreshOfflineTableData();
    // },
    getTableData: () => {
      return getTableInstance().getTableData();
    },
    getPagination: () => {
      return getTableInstance().getPagination();
    },
    setProps: (...args) => {
      return getTableInstance().setProps(...args);
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource();
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef();
    },
    updateTableData: (index: number, key: string, value: any) => {
      return getTableInstance().updateTableData(index, key, value);
    },
    deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
      return getTableInstance().deleteTableDataRecord(rowKey);
    },
    insertTableDataRecord: (
      record: Recordable | Recordable[],
      index?: number
    ) => {
      return getTableInstance().insertTableDataRecord(record, index);
    },
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
      return getTableInstance().updateTableDataRecord(rowKey, record);
    },
    findTableDataRecord: (rowKey: string | number) => {
      return getTableInstance().findTableDataRecord(rowKey);
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show);
    },
    getShowPagination: () => {
      return toRaw(getTableInstance().getShowPagination());
    },
    getForm: () => {
      return unref(formRef) as unknown as FormActionType;
    },
    // 不想在外部监听Selection事件的，直接通过这个方法取
    getSelectionData: (): Recordable[] => {
      return getTableInstance().getSelectionData();
    },
  };
  return [register, methods];
}