import { propTypes } from '@p-helper/utils/propTypes';
import {
  DEFAULT_FILTER_FN,
  DEFAULT_SORT_FN,
  FETCH_SETTING,
} from '@p-helper/components/Table/src/const';
import type {
  BasicActionColumn,
  BasicColumn,
  FetchSetting,
  SorterResult,
  TableActionType,
} from '@p-helper/components/Table/src/types/table';
import type { FormActionType, FormProps } from '@p-helper/components/Form';
import type { PropType } from 'vue';
import type {
  EditRecordRow,
  Params,
} from '@p-helper/components/Table/src/components/editable';
import type { ActionItem } from '@p-helper/components/Table/src/types/tableAction';
import type { PaginationProps } from './types/pagination';

export interface CurrencyParams {
  record: EditRecordRow;
  index?: number;
  row: Record<string, any>;
  prop?: string | number;
  column: BasicColumn;
  elColumn?: Record<string, any>;
  value?: string | number | boolean | Recordable;
}
export interface TableCustomCellParams {
  index: number;
  row: Record<string, any>;
  elColumn: Record<string, any>;
  value?: string | number | boolean | Recordable;
}

export type TableApi = (data?: Record<string, any>) => Promise<any>;

export const basicProps = {
  columnDefaultAlign: {
    type: String as PropType<BasicColumn['align']>,
  },
  editRow: {
    type: [Boolean, Function] as PropType<
      boolean | ((record: CurrencyParams) => boolean)
    >,
    default: false,
  },
  cardTitle: propTypes.string,
  // 使用搜索表单
  useSearchForm: propTypes.bool,
  // 在自动高度的基础上 修改高度的偏移量
  offsetHeight: propTypes.number,
  // 立即请求接口
  immediate: { type: Boolean, default: true },
  dataSource: {
    type: Array as PropType<Recordable[]>,
    default: null,
  },

  loading: propTypes.bool,
  tableLoading: {
    type: Boolean,
    default: true,
  },

  rowKey: {
    type: [String, Function] as PropType<
      string | ((record: Recordable) => string)
    >,
    default: '',
  },
  autoCreateKey: { type: Boolean, default: true },

  pagination: {
    type: [Object, Boolean] as PropType<PaginationProps | boolean>,
    default: null,
  },
  offlinePaging: { type: Boolean, default: false },
  queryDataMethods: {
    type: Array as PropType<TableApi[]>,
    default: () => [],
  },
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  beforeFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  afterFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING;
    },
  },
  // 默认的排序参数
  defSort: {
    type: Object as PropType<Recordable>,
    default: null,
  },

  // 额外的请求参数
  searchInfo: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  queryParams: {
    type: Object,
    default: () => ({}),
  },
  // 表单配置
  formConfig: {
    type: Object as PropType<Partial<FormProps>>,
    default: null,
  },
  columns: {
    type: Array as PropType<BasicColumn[]>,
    default: () => [],
  },
  // 是否根据父节点撑满高度
  fullHeight: propTypes.bool,
  // 流体高度，最大高度为撑满当前设定的块的高度
  autoMaxFullHeight: propTypes.bool,
  height: {
    type: [Number, String],
  },
  autoQuery: {
    type: Boolean,
    default: true,
  },
  noPage: {
    type: Boolean,
    default: false,
  },
  beforeEditSubmit: {
    type: Function as PropType<(data: CurrencyParams) => Promise<any>>,
  },
  actionColumn: {
    type: Object as PropType<BasicActionColumn>,
    default: null,
  },
  // actions中的按钮必定直接展示在column列中,优先级比actionColumn.allActions高
  actions: {
    type: Array as PropType<ActionItem[] | ((obj: Params) => ActionItem[])>,
    default: null,
  },
  // dropDownActions中的按钮必定在column列中的下拉中,优先级比actionColumn.allActions高
  dropDownActions: {
    type: Array as PropType<ActionItem[] | ((obj: Params) => ActionItem[])>,
    default: null,
  },

  dropDownButtonText: {
    type: String as PropType<string | ((obj: Params) => string)>,
    default: '',
  },
  handleSearchInfoFn: {
    type: Function as PropType<Fn>,
    default: null,
  },
  clearSelectOnPageChange: propTypes.bool,

  sortFn: {
    type: Function as PropType<(sortInfo: SorterResult) => any>,
    default: DEFAULT_SORT_FN,
  },
  filterFn: {
    type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
    default: DEFAULT_FILTER_FN,
  },
  canResize: { type: Boolean, default: true },

  scroll: {
    type: Object as PropType<{ x: number | true; y: number }>,
    default: null,
  },
  resizeHeightOffset: propTypes.number.def(0),
  isCanResizeParent: { type: Boolean, default: false },

  parentContainerClassName: {
    type: String,
  },
};

export interface TableEditParams {
  row: any;
  column: any;
  index: any;
  record: any;
  prop: any;
}
export const basicTableEmits = {
  selectionChange: (rows: Recordable) => [],
  register: (instance: TableActionType, formInstance: FormActionType) => [
    instance,
    formInstance,
  ],
  'edit-end': (obj: TableEditParams) => [obj],
  'edit-cancel': (obj: TableEditParams) => [obj],
  'edit-change': (obj: TableEditParams) => [obj],
  'edit-row-end': (obj: TableEditParams) => [obj],
  change: (obj: TableEditParams) => [obj],
  'fetch-success': (items, total) => [items, total],
  'fetch-error': (error) => [error],
  'expand-change': (row: any, expandedRows: any[]) => [row, expandedRows],
};
