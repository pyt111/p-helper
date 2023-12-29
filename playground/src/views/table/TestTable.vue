<template>
  <div class="test-table-wrapper">
<!--    <el-button @click="openModal(true)">asd</el-button>-->
<!--    <el-button @click="onAdd">新增</el-button>-->
<!--    <el-button @click="onEdit">编辑行</el-button>-->
    <BasicTable @register="register" @select="onSelect">
      <template #form-formLeft>
        <el-button>ddd</el-button>
      </template>
    </BasicTable>

    <!--    <BasicModal-->
    <!--      :ok-button-props="{ disabled: true }"-->
    <!--      @register="registerModal"-->
    <!--      @ok="onOk"-->
    <!--    >-->
    <!--      <BasicForm @register="registerForm" />-->
    <!--    </BasicModal>-->
    <!--    <BasicUpload :api="uploadApi" />-->
  </div>
</template>

<script lang="tsx" setup>
  import { computed, h, nextTick, ref, toRaw, toRefs, unref } from 'vue';
  import {
    BasicForm,
    BasicModal,
    BasicTable,
    BasicUpload,
    TableIconCell,
    TableTooltipHeader,
    useForm,
    useModal,
    useTable,
  } from '@p-helper/components';
  import { ElText } from 'element-plus';
  import VueTypes from 'vue-types';
  import { View } from '@element-plus/icons-vue';
  import type { BasicColumn } from '@p-helper/components';

  // TestTable

  const prop = defineProps({
    t: VueTypes.number,
  });
  console.log('prop >--->', prop, prop.t);

  const uploadApi = async () => {
    return {
      code: 200,
      data: {
        url: 'asd',
      },
      msg: 'sss',
    };
  };
  const [
    register,
    {
      deleteTableDataRecord,
      getColumns,
      insertTableDataRecord,
      getCellRecord,
      getDataSource,
      setTableData,
      setProps,
      getSelectionData,
    },
  ] = useTable({
    // fullHeight: true,
    // autoMaxFullHeight: true,
    // offlinePaging: true,
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
            ds: 333,
            ds1: 555,
            ds2: 666,
            badgeValue: 2,
          },
          {
            id: 15,
            d: 32,
            c: 42,
            a: '33asd3',
            ds1: 777,
            ds2: 888,
            badgeValue: 10,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            ds1: '',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
          },
          {
            id: 1002,
            d: 52,
            c: 62,
            a: '555',
            badgeValue: 6,
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
        prop: 'index',
        label: '序号',
        type: 'index',
        totalIndex: true,
      },
      {
        prop: 'ds',
        label: 'ds',
        align: 'center',
        children: [
          {
            prop: 'ds1',
            label: 'ds1',
            // editRow: true,
            align: 'right',
          },
          {
            prop: 'ds2',
            label: 'ds2',
            // editRow: true,
          },
        ],
      },
      {
        label: '浏览量',
        prop: 'ds2',
        // edit: true,
        // editComponent: 'Input',
        columnSlots: {
          // default: () => 'asd',
          // header: ({ column }) => {
          //   return h(
          //     ElTooltip,
          //     {
          //       placement: 'top',
          //       content: 'asdd',
          //     },
          //     {
          //       default: () => '浏览量',
          //     }
          //   );
          // },
        },
      },
      {
        prop: 'ds2',
        label: 'ds33',
        columnSlots: {
          header: ({ column }) => {
            return h(TableTooltipHeader, {
              label: column.label,
              content: 'sdddddd',
            });
          },
        },
      },
      {
        prop: 'd',
        label: 'd',
        // editRow: true,
        // component: 'BadgeActionCell',
        componentProps: {
          // label: 'sssddd',
          elIcon: 'Share',
          badge: {
            valueKey: 'badgeValue',
            // value: () => {
            //   return 2;
            // },
          },
          onClick: ({ row }) => {
            console.log('asdasdasdasd >--->', row);
          },
          popConfirm: {
            title: '确定删除吗？',
            confirm: ({ row }) => {
              console.log('确定删除吗----- >--->', row);
            },
          },
        },
        // editFilterShow: (obj) => {
        //   console.log(' editFilterShow>--->', obj);
        //   return obj.index === 1;
        // },
      },
      {
        prop: 'c',
        label: 'c',
        // editRow: true,
        // editable: true,
        // editFilterShow: (obj) => {
        //   console.log(' editFilterShow>--->', obj);
        //   return obj.index === 1;
        // },
      },
      {
        prop: 'a',
        label: 'a1',
        component: () => h(ElText),
        // componentProps: ({ row }) => {
        //   return {
        //     icon: 'code',
        //     label: row.a,
        //   };
        // },
        // edit: true,
        // editComponent: 'Input',
        // editDecisionButtonShow: false,
        // editIsUpdateOnChange: true,
        // editRender: () => <el-button>sss</el-button>,
        // editSlots: {
        //   prefix: () => {
        //     return 'editSlots';
        //   },
        // },
      },
      {
        prop: 'a',
        label: 'cca',
        // edit: true,
      },
      {
        prop: 'a',
        label: 'ccas',
        component: 'TableIconCell',
        columnSlots: {
          header: ({ column }) => {
            return h(TableTooltipHeader, {
              label: column.label,
              content: 'ssddd',
            });
          },
        },
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
          preIcon: ({ index }) => (index ? 'bar' : ''),
          suffixIcon: ({ row, index }) => (!index ? 'code' : ''),
          suffixIconProps: {
            // color: 'blue',
          },
          elText: {
            type: 'success',
          },
          // size: '12',
          // suffixIcon: 'code',
          // class: 'asd',
          // color: 'red',
        }),
        // customRender: ({ row, record, index }) => {
        //   return () => {
        //     return <TableIconCell icon="code" cellText={row.a} size="12" />;
        //   };
        // },
      },
    ],
    useSearchForm: true,
    // rowKey: 'id',
    // columnDefaultAlign: 'center',
    dropDownButtonText: '更多',
    // actionColumn: {
    //   label: '操作',
    //   editRow: true,
    //   minWidth: 380,
    //   editButtonsProps: () => {
    //     return [
    //       {
    //         buttonName: 'save',
    //         onClick: async ({ record }) => {
    //           const pass = await record.onValid();
    //           console.log('pass >--->', pass);
    //           if (pass) {
    //             record.onEdit(false, true);
    //             const data = record.editValueRefs;
    //             console.log('data >--->', unref(data));
    //           }
    //           // obj.record.onEditRowSave().then(() => {
    //           //   console.log('obj >--->', obj.row.ds2);
    //           // });
    //           // tableFieldInfo_update({
    //           //   id: obj.row?.id,
    //           // }).then((res) => {
    //           //   updateTableDataRecord(obj.row.key, res.data || {});
    //           //   obj.record.onEditRow();
    //           // });
    //         },
    //       },
    //     ];
    //   },
    //   allActions: () => [
    //     {
    //       label: '删除1',
    //       // ifShow: (action, { row, record }) => {
    //       //   return !record.isEditableRow();
    //       // },
    //       elIcon: 'Share',
    //       // dynamicLoading: ({ row, index, record }) => {
    //       //   return record.loading;
    //       // },
    //       popConfirm: {
    //         title: '删除提醒',
    //         confirm: (obj) => {
    //           const { index, row, record, elColumn } = obj;
    //           // console.log('删除提醒 >--->', elColumn);
    //           // record.setLoading(true, record);
    //           // record.loading = true;
    //           // record.updateTableActionUi();
    //         },
    //       },
    //       badge: {
    //         value: '31',
    //         isDot: true,
    //       },
    //       icon: 'code|svg',
    //       // onClick: (obj) => {
    //       //   const { index, row, record } = obj;
    //       //   console.log('row.id >--->', row.id, row);
    //       //   deleteTableDataRecord(row.id || row.key);
    //       //   record.onEditRow(record.getIsRowEditCacheRowKeys());
    //       // },
    //     },
    //     {
    //       label: '删除2',
    //       preIcon: View,
    //       suffixIcon: 'code',
    //       suffixIconProps: {
    //         color: 'blue',
    //         disabled: true,
    //       },
    //       type: 'danger',
    //       badge: {
    //         value: '31',
    //         isDot: true,
    //       },
    //       popConfirm: {
    //         title: '提醒',
    //         confirm: (obj) => {
    //           console.log('obj >--->', obj);
    //         },
    //       },
    //       // onClick: (obj) => {
    //       //   const { index, row, record } = obj;
    //       //   deleteTableDataRecord(row.id || row.key);
    //       //   record.onEditRow(record.getIsRowEditCacheRowKeys());
    //       // },
    //     },
    //     {
    //       label: '删除3',
    //       ifShow: (action, { row, record }) => {
    //         // console.log('record >--->', record);
    //         return !record.isEditableRow?.();
    //       },
    //       onClick: (obj) => {
    //         const { index, row, record } = obj;
    //         console.log(' 删除3>--->');
    //         // deleteTableDataRecord(row.id || row.key);
    //         // record.onEditRow(record.getIsRowEditCacheRowKeys());
    //       },
    //     },
    //     {
    //       label: '删除4',
    //       onClick: (obj) => {
    //         const { index, row, record } = obj;
    //         deleteTableDataRecord(row.key);
    //         // record.onEditRow(record.getIsRowEditCacheRowKeys());
    //       },
    //     },
    //   ],
    // },
    actions: [
      {
        label: '编辑1',
        onClick: ({ record }) => {
          record.onEdit(true);
        },
      },
      {
        label: '删除',
        ifShow: (action, { row, record }) => {
          return !record.isEditableRow?.();
        },
        // icon: 'code|svg',
        elIcon: View,
        suffixIcon: 'bar',
        suffixIconProps: {
          color: 'red',
          disabled: true,
        },
        preIcon: 'code',
        // disabled: true,
        // preIconProps: {
        //   disabled: true,
        // },
        onClick: (obj) => {
          const { index, row, record } = obj;
          // console.log('row.id >--->', row.id, row);
          deleteTableDataRecord(row.key);
          // record.onEditRow(record.getIsRowEditCacheRowKeys());
        },
      },
      // {
      //   label: '保存',
      //   ifShow: (action, { row, record }) => {
      //     return record.isEditableRow();
      //   },
      //   onClick: ({ row, record, index }) => {
      //     record.onEditRowSave(index, true);
      //     console.log('保存 cacheEditRows >--->', record.cacheEditRows);
      //   },
      // },
      // {
      //   label: '取消',
      //   ifShow: (action, { row, record }) => {
      //     return record.isEditableRow();
      //   },
      //   onClick: ({ row, record, index }) => {
      //     // console.log('index >--->', index, row, record);
      //     record.onEditRowCancel(row.id || row.key);
      //     console.log('取消 cacheEditRows >--->', record.cacheEditRows);
      //   },
      // },
    ],
    dropDownActions: [
      {
        label: '删除7',
        ifShow: (action, { row, record }) => {
          return !record.isEditableRow?.();
        },
        type: 'primary',
        elIcon: 'Share',
        // preIcon: View,
        // suffixIcon: 'code',
        onClick: (obj) => {
          const { index, row, record } = obj;
          console.log('row.id >--->', row.id);
          deleteTableDataRecord(row.id || row.key);
          record.onEditRow(record.getIsRowEditCacheRowKeys());
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
          componentProps: {},
        },
        {
          field: 'asd',
          label: 'ssss',
          component: 'Cascader',
          componentProps: () => ({
            props: {},
            options: [{ label: '', value: '' }],
          }),
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
    //   asd: [{ message: '请输入11', required: true, trigger: 'blur' }],
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
        rules: [{ required: true, message: '请选择日期' }],
      },
      {
        field: 'dst',
        label: '数字',
        component: 'Render',
        render: () => {
          return '数字';
        },
      },
      {
        field: 'dst',
        label: '上传',
        component: 'Upload',
        componentProps: {
          api: async () => {
            return {
              code: 200,
              data: {
                url: 'asd',
              },
              msg: 'sss',
            };
          },
          showPreview: true,
        },
      },
      {
        field: 'ssd',
        label: '测试-FormRadioGroup',
        component: 'RadioGroup',
        componentProps: (obj, aaa) => {
          console.log('obj >--->', aaa);
          return {
            disabled: !!obj.formModel.asd,
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
          };
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

  const onSelect = (v) => {
    console.log('onSelect >--->', v);
  };
  const onAdd = () => {
    // setTableData([{}, ...getDataSource()]);
    const d = insertTableDataRecord({}, 0);
    // const data = getDataSource();
    nextTick(() => {
      const record = getCellRecord(d[0].key);
      record.onEdit(true);
    });
    // const d = insertTableDataRecord({}, 0);
    // const { onEditRow, getIsRowEditCacheRowKeys } = getEditRowRecord();
    // const keys = getIsRowEditCacheRowKeys();
    // onEditRow([0, ...keys], true);
    // console.log('d >--->', d);
  };

  const onEdit = () => {
    // const { onEditRow } = getEditRowRecord();
    // onEditRow([0, 2], true);
  };

  const onOk = (_, val) => {
    submit();
    console.log('onOk >--->', getFieldsValue());
    // closeModal();
  };
</script>

<style scoped>
  .test-table-wrapper {
    height: 100vh;
  }
</style>
