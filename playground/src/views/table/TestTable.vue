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

<script lang="tsx" setup>
  import { computed, nextTick, ref } from 'vue';
  import {
    BasicForm,
    BasicModal,
    BasicTable,
    TableIconCell,
    useForm,
    useModal,
    useTable,
  } from '@p-helper/components';
  import type { BasicColumn } from '@p-helper/components';
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
        // editDecisionButtonShow: false,
        editIsUpdateOnChange: true,
      },
      {
        prop: 'a',
        label: 'cca',
      },
      {
        prop: 'a',
        label: 'ccas',
        component: 'TableIconCell',
        // component: ({ row, column }) => (
        //   <div>
        //     <el-button>{row.a}</el-button>
        //     <el-button>asd</el-button>
        //   </div>
        // ),
        // componentProps: {
        //   icon: 'code',
        //   size: '12',
        //   suffixIcon: 'code',
        // },
        componentProps: ({ row }) => ({
          icon: ({ index }) => (index ? 'code' : ''),
          suffixIcon: ({ row, index }) => (index ? 'code' : ''),
          // size: '12',
          // suffixIcon: 'code',
          cellText: row.a,
        }),
        // customRender: ({ row, record, index }) => {
        //   return () => {
        //     return <TableIconCell icon="code" cellText={row.a} size="12" />;
        //   };
        // },
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
  const [registerForm, { submit, getFieldsValue }] = useForm({
    // rules: {
    //   asd: [{ message: '请输入', required: true, trigger: 'blur' }],
    //   // bb: [
    //   //   { message: '请输入111', required: true, trigger: 'blur' },
    //   //   {
    //   //     pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
    //   //     message: '只能以字母开头,含有数字、字母、下划线',
    //   //   },
    //   // ],
    // },
    schemas: [
      {
        field: 'asd',
        label: 'ssss',
        component: 'DatePicker',
        required: true,
      },
      {
        field: 'ssd',
        label: '测试-FormRadioGroup',
        component: 'RadioGroup',
        componentProps: {
          options: [
            {
              label: '444',
              content: '选项1',
            },
            {
              label: '123',
              content: '选项2',
            },
          ],
        },
      },
      {
        field: 'bb',
        label: 'aaa2',
        component: 'Input',
        itemProps: {
          // rules: [{ required: true, message: '请输入' }],
        },
        rules: [
          { required: true, message: '不允许为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: '只能以字母开头,含有数字、字母、下划线',
            trigger: 'blur',
          },
        ],
      },
      {
        label: '任务名称',
        field: 'taskName',
        component: 'Input',
        componentProps: {
          placeholder: '请输入任务名称',
        },
        rules: [{ required: true, message: '不允许为空' }],
      },
      // 任务code, 数据源类型,kafka数据源地址,kafka的topic,数据源【下拉框】,数据库【下拉框】
      {
        label: '任务code',
        field: 'taskCode',
        component: 'Input',
        componentProps: {
          placeholder: '请输入英文名，允许中文数字字母或下划线',
        },
        required: true,
        rules: [
          { required: true, message: '不允许为空' },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: '只能以字母开头,含有数字、字母、下划线',
          },
        ],
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

  const onOk = (_, val) => {
    submit();
    console.log('onOk >--->', getFieldsValue());
    // closeModal();
  };
</script>

<style scoped>
  .test-table-wrapper {
    height: 100%;
  }
</style>
