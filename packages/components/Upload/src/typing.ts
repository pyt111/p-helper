export interface UploadApiResult {
  message: string;
  code: number;
  url: string;
}
export enum UploadResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  UPLOADING = 'uploading',
}

export interface FileItem {
  thumbUrl?: string;
  name: string;
  size: string | number;
  type?: string;
  percent: number;
  file: File;
  status?: UploadResultStatus;
  responseData?: UploadApiResult;
  uuid: string;
}

export interface BaseFileItem {
  uid: string | number;
  url: string;
  name?: string;
}

export interface PreviewFileItem {
  url: string;
  name: string;
  type: string;
}

export interface FileBasicColumn {
  /**
   * 表单元格的呈现器。返回值应该是VNode，或colSpan/rowSpan配置的对象
   * @type Function | ScopedSlot
   */
  customRender?: Function;
  /**
   * 此列的标题
   * @type any (string | slot)
   */
  label: string;

  /**
   * 此列的宽度
   * @type string | number
   */
  width?: number;
  /**
   * 数据记录的显示字段，可以像a.b.c一样设置
   * @type string
   */
  prop: string;
  /**
   * 指定内容的对齐方式
   * @default 'left'
   * @type string
   */
  align?: 'left' | 'right' | 'center';
}
