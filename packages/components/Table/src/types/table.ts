import type {
  EditRecordRow,
  EditRowRecordRow,
  Params,
  TableActionParams,
} from '@p-helper/components/Table/src/components/editable';
import type { ActionItem } from './tableAction';
import type ElSelect from 'element-plus/es/components/select';
import type { ComponentPropsMap } from '../../componentMap';
import type { TableProps } from 'element-plus/es/components/table/src/table/defaults';
import type { CurrencyParams, basicProps } from '../props';
import type { PaginationProps } from './pagination';
import type { ComponentType, CustomComponentType } from './componentType';
import type { ExtractPropTypes, VNode, VNodeChild, h } from 'vue';
import type ElTree from 'element-plus/es/components/tree';

export declare type SortOrder = 'ascend' | 'descend';

export interface FetchParams {
  searchInfo?: Recordable;
  page?: number;
  sortInfo?: Recordable;
  filterInfo?: Recordable;
}

export interface SorterResult {
  column: BasicColumn;
  order: SortOrder;
  field: string;
  columnKey: string;
}

export interface FetchSetting {
  // 请求接口当前页数
  pageField?: string;
  // 每页显示多少条
  sizeField?: string;
  // 请求结果列表字段  支持 a.b.c
  listField?: string;
  // 请求结果总数字段  支持 a.b.c
  totalField?: string;
}

export type BasePropsType = ExtractPropTypes<typeof basicProps>;

export interface GetColumnsParams {
  ignoreIndex?: boolean;
  ignoreAction?: boolean;
  sort?: boolean;
}

export interface TableActionType {
  reload: <T = any>(opt?: FetchParams) => Promise<T>;
  getRawDataSource: <T = Recordable>() => T;
  getDataSource: <T = Recordable>() => T[];
  setLoading: (loading: boolean) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setTableData: <T extends Recordable>(values: T[]) => void;
  updateTableDataRecord: (
    rowKey: string | number,
    record: Recordable
  ) => Recordable | void;
  deleteTableDataRecord: (
    rowKey: string | number | string[] | number[]
  ) => void;
  insertTableDataRecord: (
    record: Recordable,
    index?: number
  ) => Recordable | void;
  findTableDataRecord: (rowKey: string | number) => Recordable | void;
  updateTableData: (index: number, key: string, value: any) => Recordable;
  setShowPagination: (show: boolean) => Promise<void>;
  getShowPagination: () => boolean;
  getPaginationRef: () => PaginationProps | boolean;
  getTableData: () => Recordable[];
  getColumns: (opt?: GetColumnsParams) => BasicColumn[];
  getEditRowRecord: (rows?: Recordable[]) => EditRowRecordRow;
  getRowDataByRowIndex: (rowIndex: number | number[]) => Recordable;
  getPagination: () => PaginationProps | boolean;
  redoHeight: () => void;
  // refreshOfflineTableData: () => void; // 前端分页
  renderPagination: () => void; // 生成分页函数
  setProps: (props: Partial<BasicTableProps>) => void;
  getSelectionData: <T = Recordable>() => T[];
  emit?: EmitType;
}
export declare type AlignType = 'left' | 'center' | 'right';

export type TableComponentTypes =
  | ComponentType
  | CustomComponentType
  | ReturnType<typeof h>
  | ((obj?: ComponentPropsParams) => ReturnType<typeof h>)
  | JSX.Element;

export type ColumnTypes = {
  // component?: TableComponentTypes;
  children?: BasicColumn[];
  prop?: string;
  label: string;
  type?: 'selection' | 'index' | 'expand';
  align?: AlignType;
  fixed?: boolean | 'left' | 'right';
  custom?: boolean;
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';
  // 是否默认隐藏列，可以在列配置中显示
  defaultHidden?: boolean;
  formatter?: (
    _row: Record<string, any>,
    _style: Record<string, any>,
    val,
    index: number
  ) => any;
  width?: number | string;
  minWidth?: number | string;
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  auth?: string;
  edit?: boolean; // 是否开启单元格编辑
  alwaysBright?: boolean | ((obj: CurrencyParams) => boolean); // 是否常亮编辑状态
  showOverflowTooltip?: boolean;
  editRow?: boolean; // 是否开启行编辑
  editable?: boolean; // 是否处于编辑状态
  editAlwaysShow?: boolean; // 是否长亮编辑按钮
  editDecisionButtonShow?: boolean | ((obj: CurrencyParams) => boolean); // 是否显示编辑状态下的提交与取消按钮
  editIsUpdateOnChange?: boolean; // 是否在编辑状态下实时更新数据
  editSlots?: Record<
    string,
    VNode | VNode[] | ((args: Record<string, any>) => VNode | VNode[])
  >;
  editValueMap?: (value: any, obj: CurrencyParams) => string; // 对应单元格值枚举
  editComponentProps?: Record<string, any> & {
    options?: LabelValueOptions;
    onChange?: (config: CurrencyParams, ...value: any) => void;
    beforeEditSubmit?: BasePropsType['beforeEditSubmit'];
  }; // 对应编辑组件的 props
  record?: EditRecordRow;
  editComponent?: ComponentType; // 编辑组件
  editFilterShow?: boolean | ((obj: CurrencyParams) => boolean); // 过滤当前列 哪些不编辑 返回true是编辑 false不可编辑
  customRender?: (obj: Params) => TableComponentTypes | null | undefined | void;
  // 自定义修改后显示的内容
  editRender?: (opt: CurrencyParams) => VNodeChild | JSX.Element;
};

export type ComponentPropsParams = {
  row: Record<string, any>;
  column: Record<string, any>;
  index: number;
};

export type ComponentPropsFn = (
  obj: ComponentPropsParams
) => ColumnTypesExpand['componentProps'];
export type ColumnTypesExpand =
  | {
      component?:
        | ((obj: ComponentPropsParams) => VNode | JSX.Element)
        | JSX.Element
        | VNode
        | VNode[];
      componentProps?: never;
    }
  | {
      component?: 'Input';
      componentProps?: ComponentPropsFn | ComponentPropsMap['Input'];
    }
  | {
      component?: 'InputNumber';
      componentProps?: ComponentPropsFn | ComponentPropsMap['InputNumber'];
    }
  | {
      component?: 'Select';
      componentProps?: ComponentPropsFn | ComponentPropsMap['Select'];
    }
  | {
      component: 'TreeSelect';
      componentProps?: (
        | ComponentPropsFn
        | Partial<InstanceType<typeof ElSelect> & InstanceType<typeof ElTree>>
      ) & {
        data: any;
      };
    }
  | {
      component?: 'TreeSelect';
      componentProps?: ComponentPropsFn | ComponentPropsMap['Select'];
    }
  | {
      component?: 'Switch';
      componentProps?: ComponentPropsFn | ComponentPropsMap['Switch'];
    }
  | {
      component?: 'Checkbox';
      componentProps?: ComponentPropsFn | ComponentPropsMap['Checkbox'];
    }
  | {
      component?: 'DatePicker';
      componentProps?: ComponentPropsFn | ComponentPropsMap['DatePicker'];
    }
  | {
      component?: 'TimePicker';
      componentProps?: ComponentPropsFn | ComponentPropsMap['TimePicker'];
    }
  | {
      component?: 'TableIconCell';
      componentProps?: ComponentPropsFn | ComponentPropsMap['TableIconCell'];
    };
export type BasicColumn = ColumnTypes & ColumnTypesExpand;

export type TypeOrReturnTypeFun<T> = T | ((params: TableActionParams) => T);

export type TableActions = TypeOrReturnTypeFun<ActionItem[]>;

export type BasicActionColumn = BasicColumn &
  Partial<{
    editButtonsProps: TableActions;
    allActions: TableActions;
    showButtonsLength: TypeOrReturnTypeFun<number>;
  }>;

// @ts-ignore
export interface BasicTableProps extends BasePropsType, TableProps<any> {
  columns: BasicColumn[];
  childrenColumnName?: string;
  // 请求之前处理参数
  beforeFetch?: Fn;
  // 自定义处理接口返回参数
  afterFetch?: Fn;

  /**
   * 过滤器或排序器更改时执行的回调
   * @param pagination
   * @param filters
   * @param sorter
   * @param currentDataSource
   */
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}
