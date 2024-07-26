<template>
  <div class="test-table-wrapper">
    <BasicTable @register="register" />
  </div>
</template>

<script lang="tsx" setup>
  import { h, nextTick } from 'vue';
  import { ElTag, ElText } from 'element-plus';
  import {
    BasicTable,
    useForm,
    useModal,
    useTable,
  } from '@p-helper/components';
  import VueTypes from 'vue-types';

  // TestTable

  const prop = defineProps({
    t: VueTypes.number,
  });

  const uploadApi = async () => {
    return {
      code: 200,
      data: [
        {
          meta: {
            title: '规划',
            icon: 'ri:pencil-ruler-line',
          },
          children: [
            {
              path: '/dw-plan',
              component: 'Layout',
              name: 'dwPlan',
              redirect: '/dw-plan/business-module',
              meta: {
                title: '数据域管理',
                icon: 'uim:box',
              },
              children: [
                {
                  path: 'business-module',
                  name: 'businessModulePage',
                  component: 'dw-plan/business-module/index.vue',
                  meta: {
                    title: '数据域管理',
                    icon: 'uim:box',
                    menu: false,
                    breadcrumb: false,
                    activeMenu: '/dw-plan',
                  },
                },
              ],
            },
            {
              path: '/public-definition',
              name: 'publicDefinition',
              component: 'Layout',
              redirect: '/public-definition/statistical-period',
              meta: {
                title: '公共定义',
                icon: 'uim:box',
              },
              children: [
                {
                  path: 'statistical-period',
                  name: 'statisticalPeriod',
                  component: 'dw-plan/statistic-period/index.vue',
                  meta: {
                    title: '统计周期',
                    icon: 'uim:box',
                  },
                },
              ],
            },
          ],
        },
        // {
        //   meta: {
        //     title: '数据研发',
        //     icon: 'heroicons-outline:light-bulb',
        //     // auth: ['permission.browse', 'permission.browse'],
        //   },
        //   children: [
        //     {
        //       path: '/dev-pipe-line',
        //       name: 'dev-pipe-line',
        //       component: 'Layout',
        //       meta: {
        //         title: '需求管理',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: '',
        //           name: 'dev-pipe-line-page',
        //           component: 'dipc/dev-pipe-line/main.vue',
        //           meta: {
        //             title: '需求管理',
        //             icon: 'uim:box',
        //             menu: false,
        //             breadcrumb: false,
        //           },
        //         },
        //         {
        //           path: 'detail',
        //           name: 'dev-pipe-line-detail',
        //           component: 'dipc/dev-pipe-line/detail.vue',
        //           meta: {
        //             title: '详情',
        //             menu: false,
        //             activeMenu: '/dev-pipe-line',
        //           },
        //         },
        //         {
        //           path: 'add',
        //           name: 'dev-pipe-line-add',
        //           component: 'dipc/dev-pipe-line/add.vue',
        //           meta: {
        //             title: '新建需求',
        //             menu: false,
        //             activeMenu: '/dev-pipe-line',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/modeling',
        //       name: 'modeling',
        //       component: 'Layout',
        //       redirect: '/modeling/dimension',
        //       meta: {
        //         title: '规范建模',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'dimension',
        //           name: 'dimension',
        //           meta: {
        //             title: '维度',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'dimensionIndex',
        //               component: 'dipc/modeling/dimension/index.vue',
        //               meta: {
        //                 title: '维度页',
        //                 icon: 'heroicons-outline:light-bulb',
        //                 menu: false,
        //               },
        //             },
        //             {
        //               path: 'detail',
        //               name: 'dimensionDetail',
        //               component: 'dipc/modeling/dimension/detail.vue',
        //               meta: {
        //                 title: '维度详情',
        //                 icon: 'uim:box',
        //                 menu: false,
        //                 activeMenu: '/modeling/dimension',
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'dimensionAdd',
        //               component: 'dipc/modeling/dimension/add.vue',
        //               meta: {
        //                 title: '新建维度',
        //                 icon: 'uim:box',
        //                 menu: false,
        //                 activeMenu: '/modeling/dimension',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'business-process',
        //           name: 'business-process',
        //           component: 'dipc/modeling/business-process/index.vue',
        //           meta: {
        //             title: '业务过程',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'atomic',
        //           name: 'atomic',
        //           meta: {
        //             title: '原子指标',
        //             icon: 'uim:light-bulb',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'atomic-index',
        //               component: 'dipc/modeling/atomic/index.vue',
        //               meta: {
        //                 title: '原子指标页面',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'atomic-edit',
        //               component: 'dipc/modeling/atomic/add.vue',
        //               meta: {
        //                 title: '编辑原子指标',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modeling/atomic',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'business-condition',
        //           name: 'business-condition',
        //           meta: {
        //             title: '业务限定',
        //             icon: 'uim:light-bulb',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'business-condition-index',
        //               component: 'dipc/modeling/business-condition/index.vue',
        //               meta: {
        //                 title: '业务限定页面',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'atomic-edit',
        //               component: 'dipc/modeling/business-condition/add.vue',
        //               meta: {
        //                 title: '编辑业务限定',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modeling/business-condition',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'derived-index',
        //           name: 'derived-index',
        //           meta: {
        //             title: '派生指标',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'derived-index-index',
        //               component: 'dipc/modeling/derived-index/index.vue',
        //               meta: {
        //                 title: '派生指标页面',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'derived-index-edit',
        //               component: 'dipc/modeling/derived-index/add.vue',
        //               meta: {
        //                 title: '编辑派生指标',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modeling/derived-index',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'fact-table',
        //           name: 'fact-table',
        //           component: 'dipc/modeling/factTable/index.vue',
        //           meta: {
        //             title: '事实逻辑表',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //         },
        //         {
        //           path: 'sum-table',
        //           name: 'sum-table',
        //           meta: {
        //             title: '汇总逻辑表',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'sum-table-index',
        //               component: 'dipc/modeling/sumTable/index.vue',
        //               meta: {
        //                 title: '汇总逻辑表',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 breadcrumb: false,
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'sum-table-edit',
        //               component: 'dipc/modeling/sumTable/add.vue',
        //               meta: {
        //                 title: '编辑汇总逻辑表',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modeling/sum-table',
        //               },
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //     {
        //       path: '/modelingII',
        //       name: 'modelingII',
        //       component: 'Layout',
        //       redirect: '/modelingII/dataSet',
        //       meta: {
        //         title: '敏捷建模',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'dataSet',
        //           name: 'modelingIIDimension',
        //           meta: {
        //             title: '数据集管理',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'modelingII-dimension-index',
        //               component: 'dipc/modelingII/dimension/index.vue',
        //               meta: {
        //                 title: '数据集管理',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 breadcrumb: false,
        //               },
        //             },
        //             {
        //               path: 'property',
        //               name: 'modelingII-dimension-property',
        //               component: 'dipc/modelingII/dimension/property.vue',
        //               meta: {
        //                 title: '数据集管理关系',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modelingII/dataSet',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'target',
        //           name: 'modelingII-target',
        //           meta: {
        //             title: '指标管理',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'modelingII-target-index',
        //               component: 'dipc/modelingII/target/index.vue',
        //               meta: {
        //                 title: '指标管理',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 breadcrumb: false,
        //               },
        //             },
        //             {
        //               path: 'property',
        //               name: 'modelingII-target-property-property',
        //               component: 'dipc/modelingII/target/property.vue',
        //               meta: {
        //                 title: '指标管理关系',
        //                 icon: 'uim:light-bulb',
        //                 menu: false,
        //                 activeMenu: '/modelingII/target',
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'target-monitor',
        //           name: 'modelingII-target-monitor',
        //           component: 'dipc/modelingII/target/monitor.vue',
        //           meta: {
        //             title: '指标监控',
        //             icon: 'uim:light-bulb',
        //             // activeMenu: '/modeling/derived-index',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/DataLab',
        //       name: 'DataLab',
        //       component: 'Layout',
        //       redirect: '/DataLab/SQLBuffet',
        //       meta: {
        //         title: 'DataLab',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'SQLBuffet',
        //           name: 'SQLBuffet',
        //           component: 'dipc/sqlbuffet/index.vue',
        //           meta: {
        //             title: 'SQLBuffet',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'NoteBook',
        //           name: 'NoteBook',
        //           component: 'dipc/notebook/index.vue',
        //           meta: {
        //             title: 'NoteBook',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'DataShell',
        //           name: 'DataShell',
        //           component: 'dipc/datashell/index.vue',
        //           meta: {
        //             title: 'DataShell',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/factory',
        //       name: 'factory',
        //       component: 'Layout',
        //       redirect: '/factory/dataSync',
        //       meta: {
        //         title: '离线开发',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'dataSync',
        //           name: 'dataSync',
        //           component: 'dipc/dataSync/index.vue',
        //           meta: {
        //             title: '数据同步',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'real-time-sync',
        //           meta: {
        //             title: '实时同步',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //           children: [
        //             {
        //               path: '',
        //               name: 'real-time-sync',
        //               component: 'dipc/real-time-sync/index.vue',
        //               meta: {
        //                 title: '实时同步',
        //                 icon: 'heroicons-outline:light-bulb',
        //                 menu: false,
        //                 breadcrumb: false,
        //               },
        //             },
        //             {
        //               path: 'add',
        //               name: 'real-time-sync-add',
        //               component: 'dipc/real-time-sync/add.vue',
        //               meta: {
        //                 title: '新建实时同步',
        //                 icon: 'heroicons-outline:light-bulb',
        //                 menu: false,
        //               },
        //             },
        //           ],
        //         },
        //         {
        //           path: 'code-task',
        //           name: 'code-task',
        //           component: 'dipc/factory/code-task/index.vue',
        //           meta: {
        //             title: '脚本工厂',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'task-management',
        //           name: 'task-management-calculate',
        //           component:
        //             'dipc/task-management/task-management/calculate.vue',
        //           meta: {
        //             title: '任务工厂',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'workflow-task',
        //           name: 'workflow-task',
        //           component: 'dipc/factory/workflow-task/index.vue',
        //           meta: {
        //             title: '工作流任务',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'workflow-log',
        //           name: 'workflow-log',
        //           component: 'dipc/factory/workflow-log/index.vue',
        //           meta: {
        //             title: '日志出具',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'api-data-collection',
        //           name: 'api-data-collection',
        //           component: 'dipc/api-data-collection/index.vue',
        //           meta: {
        //             title: 'API数据采集',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/_flink',
        //       name: '_flink',
        //       component: 'Layout',
        //       redirect: '/factory/calculate',
        //       meta: {
        //         title: '流式计算',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'calculate',
        //           name: 'calculate',
        //           component: 'flink/calculate.vue',
        //           meta: {
        //             title: 'FLink',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/resource-management',
        //       name: 'resource-management',
        //       component: 'Layout',
        //       redirect: '/resource-management/jar',
        //       meta: {
        //         title: '流式计算',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'jar',
        //           name: 'jar',
        //           component:
        //             'dipc/resource-management/jar-management/index.vue',
        //           meta: {
        //             title: 'jar管理',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'func',
        //           name: 'func',
        //           component:
        //             'dipc/resource-management/func-management/index.vue',
        //           meta: {
        //             title: '函数管理',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: '/dataAsset',
        //       name: 'dataAsset',
        //       component: 'Layout',
        //       redirect: '/dataAsset/metadata',
        //       meta: {
        //         title: '数据资产',
        //         icon: 'uim:box',
        //       },
        //       children: [
        //         {
        //           path: 'metadata',
        //           name: 'metadata',
        //           component: 'dataAsset/metadata.vue',
        //           meta: {
        //             title: '元数据管理',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'assetmap',
        //           name: 'assetmap',
        //           component: 'dataAsset/assetmap.vue',
        //           meta: {
        //             title: '资产版图',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'datasecurity',
        //           name: 'datasecurity',
        //           component: 'dataAsset/datasecurity.vue',
        //           meta: {
        //             title: '数据脱敏',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //         {
        //           path: 'asset-maintenance',
        //           name: 'asset-maintenance',
        //           component: 'dataAsset/index.vue',
        //           meta: {
        //             title: '资产配置维护',
        //             icon: 'heroicons-outline:light-bulb',
        //           },
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      msg: 'sss',
    };
  };
  const [
    register,
    {
      insertTableDataRecord,
    },
  ] = useTable({
    api: uploadApi,
    // fullHeight: true,
    // offlinePaging: true,
    columns: [
      {
        label: '菜单名称',
        prop: 'meta.title',
        width: 200,
        align: 'left',
      },
      {
        label: '图标',
        prop: 'icon',
        width: 60,
        customRender: ({ row, record }) => {
          if (!row.meta?.icon) {
            return '';
          }
          return row.meta.icon;
        },
      },
      {
        label: '权限标识',
        prop: 'permission',
        width: 180,
      },
      {
        label: '组件',
        prop: 'component',
      },
      {
        label: '排序',
        prop: 'orderNo',
        width: 60,
      },
      {
        label: '状态',
        prop: 'status',
        width: 80,
        // customRender: ({ record }) => {
        //   const status = record.status;
        //   const enable = ~~status === 0;
        //   const type = enable ? 'success' : 'danger';
        //   const text = enable ? '启用' : '停用';
        //   return h(ElTag, { type }, () => text);
        // },
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: 180,
      },
    ],
  });

  const [registerModal, { openModal, closeModal }] = useModal();
  const [
    registerForm,
    { submit, getFieldsValue, setFieldsValue, clearValidate },
  ] = useForm({
    // isCol: false,
    rules: {
      asd: [{ message: '请输入11', required: true, trigger: 'blur' }],
      // bb: [
      //   { message: '请输入111', required: true, trigger: 'blur' },
      //   {
      //     pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      //     message: '只能以字母开头,含有数字、字母、下划线',
      //   },
      // ],
      taskCode: [
        { required: true, message: '不允许为空' },
        {
          required: true,
          pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
          message: '只能以字母开头,含有数字、字母、下划线',
        },
      ],
    },
    defaultSchema: {
      subLabel: ':',
    },
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
        // required: true,
        rules: [{ required: true, message: '请选择日期1' }],
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
        componentProps: (obj) => {
          console.log('obj >--->', obj);
          return {
            disabled: !!obj.formModel.asd,
            options: [
              {
                value: '444',
                content: '选项1',
              },
              {
                value: '123',
                content: '选项2',
              },
            ],

            onChange: (value) => {
              console.log('RadioGroup value >--->', value);
            },
          };
        },
        suffix: '333',
      },
      {
        field: 'bb',
        label: 'aaa2',
        component: 'Input',
        required: true,
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
        defaultValue: 's',
        componentProps: {
          placeholder: '请输入英文名，允许中文数字字母或下划线',
        },
        renderComponentContent: () => {
          return {
            suffix: () => 'asd',
          };
        },
        suffix: 'tttt',
        // required: true,
        // rules: [
        //   { required: true, message: '不允许为空' },
        //   {
        //     required: true,
        //     pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
        //     message: '只能以字母开头,含有数字、字母、下划线',
        //   },
        // ],
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
      // const record = getCellRecord(d[0].key);
      // record.onEdit(true);
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

  const onOpen = () => {
    openModal(true).then(() => {
      setFieldsValue({
        taskCode: '1',
      }).then(() => {
        // clearValidate();

        setTimeout(() => {});
      });
    });
  };
</script>

<style scoped>
  .test-table-wrapper {
    height: 100vh;
  }
</style>
