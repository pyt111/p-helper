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
    <ElCard class="table-card" :header="getProps.cardTitle" shadow="never">
      <template v-if="$slots['card-header']" #header>
        <slot name="card-header" />
      </template>
      <el-table
        v-loading="getLoading"
        empty-text="暂无数据"
        :header-cell-style="{ color: 'rgb(51, 51, 51)', fontSize: '15px' }"
        stripe
        v-bind="getTableProps"
        @select="onSelect"
        @select-all="onSelect"
        @selection-change="setSelectRows"
        @sort-change="tableSortChange"
      >
        <template v-for="col in getViewColumns" :key="col.prop">
          <template v-if="col.custom">
            <el-table-column
              :align="columnDefaultAlign"
              :formatter="col.formatter || formatter"
              :show-overflow-tooltip="true"
              v-bind="col"
            >
              <template #default="{ row, column, $index }">
                <slot
                  :col="col"
                  :column="column"
                  :index="$index"
                  name="custom"
                  :row="row"
                />
              </template>
            </el-table-column>
          </template>
          <template v-else-if="col.customRender">
            <el-table-column
              :align="columnDefaultAlign"
              :formatter="col.formatter || formatter"
              :show-overflow-tooltip="true"
              v-bind="col"
            >
              <template #default="{ row, column, $index }">
                <component
                  :is="
                    col.customRender({
                      row,
                      index: $index,
                      record: col.record,
                      elColumn: column,
                    })
                  "
                  :key="col.prop"
                />
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <template v-if="col.multiColumnVNode">
              <component :is="col.multiColumnVNode" v-bind="col" />
            </template>
            <el-table-column
              :key="col.prop"
              :align="columnDefaultAlign"
              :formatter="col.formatter || formatter"
              :show-overflow-tooltip="true"
              v-bind="col"
            />
          </template>
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

<script lang="ts">
  import {
    computed,
    defineComponent,
    reactive,
    ref,
    toRaw,
    toRefs,
    unref,
  } from 'vue';
  // import { usePagination } from '@p-helper/hooks/pagination';
  import { ElCard, ElTable, ElTableColumn } from 'element-plus';
  import { cloneDeep, pick } from 'lodash-es';
  import { BasicForm, useForm } from '@p-helper/components/Form';
  import { isBoolean } from '@p-helper/utils/is';
  import { updateTableCellStatusKey } from './useTableCellVNode';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { createTableContext } from './hooks/useTableContext';
  import { useTableForm } from './hooks/useTableForm';
  import { basicProps, basicTableEmits } from './props';
  import type { BasicTableProps, TableActionType } from './types/table';

  export default defineComponent({
    name: 'BasicTable',
    components: {
      BasicForm,
      ElTable,
      ElTableColumn,
      ElCard,
    },
    props: basicProps,

    emits: basicTableEmits,

    setup(props, { emit, attrs, slots }) {
      const wrapRef = ref(null);
      const formRef = ref<any>(null);
      const bottomCardRef = ref(null);
      const paginationElRef = ref(null);
      const tableData = ref([]);
      const innerPropsRef = ref();

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
        reload,
        updateTableData,
        getRowDataByRowIndex,
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
      const { getViewColumns, getColumns, getEditRowRecord } = useColumns(
        getProps,
        {
          getRowKey,
          getDataSource,
          getRowDataByRowIndex,
          findTableDataRecord,
        }
      );

      const paginationAlign = computed(
        () =>
          (!isBoolean(getPaginationInfo.value) &&
            getPaginationInfo.value.align) ||
          'center'
      );

      const getBindValues = computed(() => {
        const dataSource = unref(getDataSourceRef);

        const bottomHeight = getBindValues.value?.noPage ? 0 : 52;
        const propsData = {
          ...unref(getProps),
          columns: toRaw(unref(getViewColumns)),
          ...attrs,
          style: {
            height: bottomHeight
              ? `calc(100% - ${bottomHeight + 10}px)`
              : false,
          },
          height: unref(getProps).height || '100%',
          currentRowKey: unref(getRowKey),
          data: dataSource,
        };

        return propsData;
      });

      const elTablePropsKeys = Object.keys(ElTable.props);
      const getTableProps = computed(() => {
        return {
          headerCellClassName: 'table-header-background', // 头部默认背景色
          ...pick(unref(getBindValues), elTablePropsKeys),
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
        getEditRowRecord,
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

        getTableData: () => {
          return unref(tableData);
        },
        getPagination: () => {
          return unref(getPaginationInfo);
        },
        setProps,
        getSelectionData: () => cloneDeep(state.selectionData),
        emit,
      };

      createTableContext({ ...tableAction, wrapRef, getBindValues });

      // const handleSearchInfoChange = (values) => {
      //   getBindValues.value.queryParams = values;
      //   queryTableData();
      // };

      const setSelectRows = (rows) => {
        // console.log('setSelectRows');
        emit('selectionChange', rows);
      };

      const onSelect = (selection: Record<string, any>[]) => {
        state.selectionData = selection;
      };

      const tableSortChange = () => {
        // console.log('tableSortChange');
      };

      const formatter = (_row, _style, val) => {
        return val ?? '--';
      };

      const handleDelete = () => {
        // console.log('handleDelete', row);
      };

      const onCellDblclick = (row, col) => {
        const key = updateTableCellStatusKey(col.prop);
        if (key) {
          row[key] = true; // 打开自定义vNode
        }
      };

      emit('register', tableAction, formActions);

      return {
        // data
        ...toRefs(state),
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
        pick,
        getProps,
        getRowKey,
        elTablePropsKeys,

        setSelectRows,
        tableSortChange,
        formatter,
        onSelect,
        // fetchData,
        handleDelete,
        // queryTableData,
        // refreshOfflineTableData,
        onCellDblclick,
        updateTableCellStatusKey,
        registerForm,
        handleSearchInfoChange,
        paginationAlign,

        getLoading,
        wrapRef,
        formRef,
        paginationElRef,
        bottomCardRef,
      };
    },
  });
</script>
