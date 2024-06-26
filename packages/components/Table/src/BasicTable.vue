<template>
  <div ref="wrapRef" class="basic-table">
    <BasicForm
      v-if="getBindValues.useSearchForm"
      ref="formRef"
      submit-on-reset
      :table-action="tableAction"
      v-bind="getFormProps"
      class="table-form-card"
      @register="registerForm"
      @submit="handleSearchInfoChange"
    >
      <template
        v-for="item in getFormSlotKeys"
        #[replaceFormSlotKey(item)]="data"
      >
        <slot :name="item" v-bind="data || {}" />
      </template>
    </BasicForm>
    <ElCard
      :class="['table-card', getProps.fullHeight ? 'table-full-height' : '']"
      :header="getProps.cardTitle"
      shadow="never"
    >
      <template v-if="$slots['card-header']" #header>
        <slot name="card-header" />
      </template>
      <el-table
        ref="tableElRef"
        v-loading="getLoading"
        empty-text="暂无数据"
        :header-cell-style="{ color: 'rgb(51, 51, 51)', fontSize: '15px' }"
        stripe
        v-bind="getTableProps"
        @select="onSelect"
        @select-all="onSelect"
        @selection-change="setSelectRows"
      >
        <template v-for="col in getViewColumns" :key="col.prop">
          <BasicColumnComponent
            :column="col"
            :record-cache="recordCache"
            :get-row-key-name="getRowKeyName"
          />
        </template>

        <template #actions="data">
          <el-table-column>
            <slot name="actions" v-bind="data || {}" />
          </el-table-column>
        </template>
      </el-table>
      <component
        :is="renderPagination()"
        v-if="!getBindValues.noPage"
        ref="paginationElRef"
        class="pagination-wrapper"
      />
    </ElCard>

    <ElCard v-if="$slots.bottom" ref="bottomCardRef" class="card-bottom">
      <slot :data="queryData" name="bottom" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import {
    computed,
    reactive,
    ref,
    toRaw,
    unref,
    useAttrs,
    useSlots,
  } from 'vue';
  import { ElCard, ElTable, ElTableColumn } from 'element-plus';
  import { cloneDeep, pick } from 'lodash-es';
  import {
    BasicForm,
    type FormActionType,
    useForm,
  } from '@p-helper/components/Form';
  import { isBoolean } from '@p-helper/utils/is';
  import { updateTableCellStatusKey } from './useTableCellVNode';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { createTableContext } from './hooks/useTableContext';
  import { useTableForm } from './hooks/useTableForm';
  import { useTableExpand } from './hooks/useTableExpand';
  import { basicProps, basicTableEmits } from './props';
  // import { CustomCellComponent } from './components/custom/CustomCellComponent';
  import BasicColumnComponent from './BasicColumn';
  import type { TableEditParams } from './props';
  import type { BasicTableProps, TableActionType } from './types/table';

  defineOptions({
    name: 'BasicTable',
  });
  const props = defineProps(basicProps);
  const emit = defineEmits(basicTableEmits);
  const slots = useSlots();
  const attrs = useAttrs();

  const tableElRef = ref(null);
  const wrapRef = ref(null);
  const formRef = ref<any>(null);
  const bottomCardRef = ref(null);
  const paginationElRef = ref(null);
  const tableData = ref([]);
  const innerPropsRef = ref();
  const elTablePropsKeys = Object.keys(ElTable.props);

  const [registerForm, formActions] = useForm({
    isCol: false,
  });

  const state = reactive({
    listLoading: false,
    layout: 'total, sizes, prev, pager, next, jumper',
    queryData: {},
    selectionData: [] as any,
  });

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) };
  });

  const getFormConfig = computed(() => {
    return {
      ...getBindValues.value.formConfig,
    };
  });

  const { getLoading, setLoading } = useLoading(getProps);

  const {
    getPaginationInfo,
    getPagination,
    setPagination,
    setShowPagination,
    getShowPagination,
    renderPagination,
  } = usePagination(getProps, {
    paginationChange,
  });

  const {
    getDataSourceRef,
    getDataSource,
    getRawDataSource,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    fetch,
    getRowKey,
    getRowKeyName,
    reload,
    updateTableData,
    getRowDataByRowIndex,
    recordCache,
    getCellRecord,
  } = useDataSource(
    getProps,
    {
      tableData,
      getPaginationInfo,
      setLoading,
      setPagination,
      getFieldsValue: formActions.getFieldsValue,
    },
    emit
  );
  const { getViewColumns, getColumns } = useColumns(getProps, {
    getRowKeyName,
    getDataSource,
    getRowDataByRowIndex,
    findTableDataRecord,
    getPaginationInfo,
    recordCache,
  });

  const {
    getExpandOption,
    expandAll,
    expandRows,
    collapseAll,
    collapseRows,
    onExpandChange,
  } = useTableExpand(getProps, tableData, emit);

  const paginationAlign = computed(
    () =>
      (!isBoolean(getPaginationInfo.value) && getPaginationInfo.value.align) ||
      'center'
  );

  const getBindValues = computed(() => {
    const dataSource = unref(getDataSourceRef);

    const propsData = {
      ...unref(getProps),
      columns: toRaw(unref(getViewColumns)),
      style: {},
      ...attrs,
      height: unref(getProps).height,
      data: dataSource,
      ...unref(getExpandOption),
    };
    const bottomHeight = propsData.noPage ? 0 : 52;
    const maxHeight = `calc(100% - ${bottomHeight}px)`;
    // 是否撑满
    if (getProps.value.fullHeight) {
      propsData.style.height = maxHeight;
      propsData.height = '100%';
    } else if (getProps.value.autoMaxFullHeight) {
      propsData.maxHeight = maxHeight;
      propsData.height = '100%';
    }

    return propsData;
  });

  const getTableProps = computed(() => {
    return {
      ...unref(getExpandOption),
      headerCellClassName: 'table-header-background', // 头部默认背景色
      ...pick(unref(getBindValues), [...elTablePropsKeys, 'onExpandChange']),
      onExpandChange,
      ...attrs,
    };
  });

  function paginationChange() {
    // 前端分页
    if (getProps.value.offlinePaging) {
      return;
    }
    fetch();
  }

  const {
    replaceFormSlotKey,
    getFormSlotKeys,
    getFormProps,
    handleSearchInfoChange,
  } = useTableForm(getProps, slots, fetch, getLoading);

  const setProps = (props: Partial<BasicTableProps>) => {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
  };

  const tableAction: TableActionType = {
    reload,
    getColumns,
    getRowDataByRowIndex,
    // refreshOfflineTableData,
    renderPagination,
    getDataSource,
    getRawDataSource,
    setTableData,
    setLoading,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    updateTableData,
    setShowPagination,
    getShowPagination,
    getPaginationRef: getPagination,
    setPagination,
    redoHeight: () => {},
    expandRows,
    collapseRows,
    expandAll,
    collapseAll,
    getTableData: () => {
      return unref(tableData);
    },
    getPagination: () => {
      return unref(getPaginationInfo);
    },
    setProps,
    getSelectionData: () => cloneDeep(state.selectionData),
    getCellRecord,
    emit,
  };

  createTableContext({ ...tableAction, wrapRef, getBindValues });

  const setSelectRows = (rows) => {
    // console.log('setSelectRows');
    emit('selectionChange', rows);
  };

  const onSelect = (selection: Record<string, any>[]) => {
    state.selectionData = selection;
  };

  const onCellDblclick = (row, col) => {
    const key = updateTableCellStatusKey(col.prop);
    if (key) {
      row[key] = true; // 打开自定义vNode
    }
  };

  emit('register', tableAction, formActions);
  // export default defineComponent({
  //   components: {
  //     BasicForm,
  //     ElTable,
  //     ElTableColumn,
  //     ElCard,
  //     CustomCellComponent,
  //     BasicColumnComponent,
  //   },
  //   props: basicProps,
  //
  //   emits: basicTableEmits,
  //
  //   setup(props, { emit, attrs, slots }) {
  //
  //     return {
  //       // data
  //       ...toRefs(state),
  //       renderPagination,
  //       tableData,
  //       // pagination,
  //       getBindValues,
  //       tableAction,
  //       getFormConfig,
  //       replaceFormSlotKey,
  //       getFormSlotKeys,
  //       getFormProps,
  //       getTableProps,
  //       getDataSourceRef,
  //       getViewColumns,
  //       getProps,
  //       getRowKey,
  //       getRowKeyName,
  //       elTablePropsKeys,
  //       recordCache,
  //
  //       setSelectRows,
  //       onSelect,
  //       onCellDblclick,
  //       updateTableCellStatusKey,
  //       registerForm,
  //       handleSearchInfoChange,
  //       paginationAlign,
  //
  //       getLoading,
  //       wrapRef,
  //       tableElRef,
  //       formRef,
  //       paginationElRef,
  //       bottomCardRef,
  //     };
  //   },
  // });

  defineExpose({
    renderPagination,
    tableData,
    // pagination,
    getBindValues,
    tableAction,
    getFormConfig,
    replaceFormSlotKey,
    getFormSlotKeys,
    getFormProps,
    getTableProps,
    getDataSourceRef,
    getViewColumns,
    getProps,
    getRowKey,
    getRowKeyName,
    elTablePropsKeys,
    recordCache,

    setSelectRows,
    onSelect,
    onCellDblclick,
    updateTableCellStatusKey,
    registerForm,
    handleSearchInfoChange,
    paginationAlign,

    getLoading,
    wrapRef,
    tableElRef,
    formRef,
    paginationElRef,
    bottomCardRef,
  });
</script>
