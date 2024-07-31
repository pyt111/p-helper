import type { FileBasicColumn, FileItem, BaseFileItem } from './typing';
import type { PromiseFn } from '@p-helper/types/utils';
import type { BasicColumn } from '@p-helper/components';
import type { ExtractPropTypes, PropType } from 'vue';

export type handleFnKey = 'record' | 'valueKey' | 'uidKey';
export type previewColumnsFnType = {
  handleRemove: (record: Record<handleFnKey, any>) => any;
  handleAdd: (record: Record<handleFnKey, any>) => any;
};

export const previewType = {
  previewColumns: {
    type: [Array, Function] as PropType<
      BasicColumn[] | ((arg: previewColumnsFnType) => BasicColumn[])
    >,
    required: false,
  },
  beforePreviewData: {
    type: Function as PropType<(arg: BaseFileItem[] | any) => Recordable<any>>,
    default: null,
    required: false,
  },
};
export const basicProps = {
  helpText: {
    type: String as PropType<string>,
    default: '',
  },
  // 文件最大多少MB
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  // 最大数量的文件，Infinity不限制
  maxNumber: {
    type: Number as PropType<number>,
    default: Infinity,
  },
  // 根据后缀，或者其他
  accept: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  uploadParams: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  api: {
    type: Function as PropType<PromiseFn>,
    default: null,
    required: true,
  },
  name: {
    type: String as PropType<string>,
    default: 'file',
  },
  filename: {
    type: String as PropType<string>,
    default: null,
  },
  beforeUpload: {
    type: Function as PropType<Function>,
    default: (file: File, fileList: FileItem[]) => true,
  },
};

export const uploadContainerProps = {
  uploadDisabled: {
    type: Boolean,
    default: false,
  },
  uploadButtonText: {
    type: String,
    default: '上传',
  },
  value: {
    type: [Array, String] as PropType<string[] | string>,
    default: () => [],
  },
  ...basicProps,
  showPreviewNumber: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  showPreview: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  emptyHidePreview: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  ...previewType,
};

export const previewProps = {
  showActionColumn: {
    type: Boolean,
    default: true,
  },
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  ...previewType,
};

export const fileListProps = {
  columns: {
    type: Array as PropType<FileBasicColumn[]>,
    default: null,
  },
  actionColumn: {
    type: Object as PropType<FileBasicColumn | null>,
    default: null,
  },
  dataSource: {
    type: Array as PropType<any[]>,
    default: null,
  },
};

export type UploadBasicProps = ExtractPropTypes<typeof basicProps>;
export type UploadFileListProps = ExtractPropTypes<typeof fileListProps>;
export type UploadPreviewProps = ExtractPropTypes<typeof previewProps>;
export type UploadUploadContainerProps = ExtractPropTypes<
  typeof uploadContainerProps
>;
