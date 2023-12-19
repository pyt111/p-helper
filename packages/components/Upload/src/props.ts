import type { FileBasicColumn, FileItem } from './typing';
import type { PromiseFn } from '@p-helper/types/utils';
import type { ExtractPropTypes, PropType } from 'vue';

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
    type: Array as PropType<string[]>,
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
};

export const previewProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
};

export const fileListProps = {
  columns: {
    type: Array as PropType<FileBasicColumn[]>,
    default: null,
  },
  actionColumn: {
    type: Object as PropType<FileBasicColumn>,
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
