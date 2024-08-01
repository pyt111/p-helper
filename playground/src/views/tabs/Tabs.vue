<template>
  <div class="test-table-wrapper">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="wrapper-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="告警配置" name="config">
        <el-tabs v-model="activeName2" class="config-tab-wrapper">
          <el-tab-pane label="API" name="api">
            <BasicTable @register="register" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
          <el-tab-pane label="CMD" name="cmd" lazy>
            <BasicTable @register="register1" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
          <el-tab-pane label="作业" name="task" lazy>
            <BasicTable @register="register2" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="告警列表" name="list">
        <el-tabs v-model="activeName2" class="config-tab-wrapper">
          <el-tab-pane label="API" name="api">
            <BasicTable @register="register3" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
          <el-tab-pane label="CMD" name="cmd" lazy>
            <BasicTable @register="register4" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
          <el-tab-pane label="作业" name="task" lazy>
            <BasicTable @register="register5" @select="onSelect">
              <!--      <template #card-header> 1asdasd </template>-->
              <template #form-formLeft>
                <el-button>ddd</el-button>
              </template>
            </BasicTable>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <el-button @click="activeStep += 1">activeStep + </el-button>
    <el-button @click="activeStep -= 1">activeStep - </el-button>
    <el-button @click="openModal(true)">asd</el-button>
    <!--    <el-button @click="onAdd">新增</el-button>-->
    <!--    <el-button @click="onEdit">编辑行</el-button>-->
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

  const uploadApi = async () => {
    return {
      code: 200,
      data: {
        url: 'asd',
      },
      msg: 'sss',
    };
  };
  const activeStep = ref(1);
  const activeName = ref();
  const activeName2 = ref();
  const config = {
    // fullHeight: true,
    autoMaxFullHeight: true,
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
            editRow: true,
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
        editRow: true,
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
        }),
      },
    ],
    useSearchForm: true,
    // rowKey: 'id',
    // columnDefaultAlign: 'center',
    dropDownButtonText: '更多',
    actionColumn: {
      label: '操作',
      editRow: true,
      minWidth: 380,
      editButtonsProps: () => {
        return [
          {
            buttonName: 'save',
            onClick: async ({ record }) => {
              const pass = await record.onValid();
              console.log('pass >--->', pass);
              if (pass) {
                record.onEdit(false, true);
                const data = record.editValueRefs;
                console.log('data >--->', unref(data));
              }
            },
          },
        ];
      },
    },
    actions: [
      {
        label: '编辑1',
        onClick: ({ record }) => {
          record.onEdit(true);
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
          suffix: '112233',
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
  };

  const [registerModal, { openModal, closeModal }] = useModal();
  const [registerForm, { submit, getFieldsValue }] = useForm({
    // isCol: false,
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
        label: ' ',
        field: '1',
        component: 'Checkbox',
        required: true,
        componentProps: {
          label: '状态',
          falseValue: '',
        },
      },
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
        suffix: '333',
      },
      {
        field: 'bb',
        label: 'aaa2',
        component: 'Input',
        itemProps: {
          // rules: [{ required: true, message: '请输入' }],
        },
        suffix: '1111',
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
        suffix: '2222',
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
        renderComponentContent: () => {
          return {
            suffix: () => 'asd',
          };
        },
        suffix: 'tttt',
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
  const [register, { insertTableDataRecord }] = useTable(config);
  const [register1] = useTable({...config});
  const [register2] = useTable({...config});
  const [register3] = useTable({...config});
  const [register4] = useTable({...config});
  const [register5] = useTable({...config});

  const onSelect = (v) => {
    console.log('onSelect >--->', v);
  };
</script>

<style scoped>
  .test-table-wrapper {
    height: 100vh;
  }
</style>
