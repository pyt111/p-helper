<template>
  <div class="test-table-wrapper">
    <el-button @click="openModal(true)">asd</el-button>
    <el-button @click="onAdd">新增</el-button>
    <el-button @click="onEdit">编辑行</el-button>
    <BasicTable @register="register">
      <template #form-formBottom />
    </BasicTable>

    <BasicModal @register="registerModal" @ok="onOk">
      <BasicForm @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref } from 'vue';
  import {
    BasicForm,
    BasicModal,
    BasicTable,
    useForm,
    useModal,
    useTable,
  } from '@p-helper/components';
  // TestTable

  const [
    register,
    {
      deleteTableDataRecord,
      getColumns,
      insertTableDataRecord,
      getEditRowRecord,
      getDataSource,
      setTableData,
      setProps,
      getSelectionData,
    },
  ] = useTable({
    beforeFetch: (params) => {
      params.catalogDataId = 1;
      return params;
    },
    api: async () => {
      return {
        data: [
          {
            id: 10,
            d: 1222,
            c: 22123,
            a: '123',
          },
          {
            id: 15,
            d: 32,
            c: 42,
            a: '33asd3',
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
          },
        ],
      };
    },
    columns: [
      {
        prop: 's',
        label: '序号',
        type: 'selection',
      },
      {
        prop: 'd',
        label: 'd',
        editRow: true,
        // editFilterShow: (obj) => {
        //   console.log(' editFilterShow>--->', obj);
        //   return obj.index === 1;
        // },
      },
      {
        prop: 'c',
        label: 'c',
        editRow: true,
        // editable: true,
        // editFilterShow: (obj) => {
        //   console.log(' editFilterShow>--->', obj);
        //   return obj.index === 1;
        // },
      },
      {
        prop: 'a',
        label: 'a',
        edit: true,
        editComponent: 'Input',
        editDecisionButtonShow: false,
        editIsUpdateOnChange: true,
      },
    ],
    useSearchForm: true,
    rowKey: 'id',
    // columnDefaultAlign: 'center',
    actionColumn: {
      label: '操作',
    },
    actions: [
      {
        label: '编辑',
        ifShow: (action, { row, record }) => {
          return !record.cacheEditRows.value?.[row.id || row.key];
        },
        onClick: (obj) => {
          const { index, record, row } = obj;
          console.log('row.id >--->', row.id);
          record.onEditRow(row.id || row.key);
          console.log('编辑 cacheEditRows >--->', record.cacheEditRows.value);
        },
      },
      {
        label: '删除',
        ifShow: (action, { row, record }) => {
          return !record.cacheEditRows.value?.[row.id || row.key];
        },
        onClick: (obj) => {
          const { index, row, record } = obj;
          console.log('row.id >--->', row.id, row);
          deleteTableDataRecord(row.id || row.key);
          record.onEditRow(record.getIsRowEditCacheRowKeys());
        },
      },
      {
        label: '保存',
        ifShow: (action, { row, record }) => {
          return record.cacheEditRows.value?.[row.id || row.key];
        },
        onClick: ({ row, record, index }) => {
          record.onEditRowSave(index, true);
          console.log('保存 cacheEditRows >--->', record.cacheEditRows);
        },
      },
      {
        label: '取消',
        ifShow: (action, { row, record }) => {
          return record.cacheEditRows.value?.[row.id || row.key];
        },
        onClick: ({ row, record, index }) => {
          // console.log('index >--->', index, row, record);
          record.onEditRowCancel(row.id || row.key);
          console.log('取消 cacheEditRows >--->', record.cacheEditRows);
        },
      },
    ],
    pagination: {
      pageSizes: [1, 2],
    },
    formConfig: {
      schemas: [
        {
          field: 'asd',
          label: 'ssss',
          component: 'Input',
        },
        {
          field: 'parentId',
          label: '上级分类',
          component: 'TreeSelect',
          componentProps: {
            data: [
              {
                label: 'asd',
                value: 'ss',
                children: [
                  {
                    label: 'sss',
                    value: 'ssee',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  });

  const [registerModal, { openModal, closeModal }] = useModal();
  const [registerForm, { submit }] = useForm({
    schemas: [
      {
        field: 'asd',
        label: 'ssss',
        component: 'DatePicker',
        required: true,
      },
      {
        field: 'bb',
        label: 'aaa',
        component: 'Input',
        required: true,
      },
    ],
  });

  const onAdd = () => {
    const d = insertTableDataRecord({}, 0);
    const { onEditRow, getIsRowEditCacheRowKeys } = getEditRowRecord();
    const keys = getIsRowEditCacheRowKeys();
    onEditRow([0, 2, ...keys], true);
  };

  const onEdit = () => {
    const { onEditRow, getIsRowEditCacheRowKeys } = getEditRowRecord();
    const keys = getIsRowEditCacheRowKeys();
    onEditRow([0, ...keys], true);
  };

  const onOk = (val) => {
    submit();
    console.log('onOk >--->', val);
    // closeModal();
  };
</script>

<style scoped>
  .test-table-wrapper {
    height: 100%;
  }
</style>
