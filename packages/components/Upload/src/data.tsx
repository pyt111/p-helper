import { ElProgress, ElTag } from 'element-plus';
import TableAction from '@p-helper/components/Table/src/components/TableAction.vue';
import { UploadResultStatus } from './typing';
import {
  // checkImgType,
  isImgTypeByName,
} from './helper';
import ThumbUrl from './ThumbUrl.vue';
import type { FileBasicColumn, FileItem, PreviewFileItem } from './typing';
import type { ActionItem, BasicColumn } from '@p-helper/components/Table';

// 文件上传列表
export function createTableColumns(): FileBasicColumn[] {
  return [
    {
      prop: 'thumbUrl',
      label: '略缩图',
      width: 100,
      customRender: ({ record }) => {
        const { thumbUrl } = (record as FileItem) || {};
        return thumbUrl && <ThumbUrl fileUrl={thumbUrl} />;
      },
    },
    {
      prop: 'name',
      label: '文件名',
      align: 'left',
      customRender: ({ text, record }) => {
        const { percent, status: uploadStatus } = (record as FileItem) || {};
        let status: 'success' | 'exception' | '' = '';
        if (uploadStatus === UploadResultStatus.ERROR) {
          status = 'exception';
        } else if (uploadStatus === UploadResultStatus.SUCCESS) {
          status = 'success';
        }
        return (
          <span>
            <p class="truncate mb-1" title={text}>
              {text}
            </p>
            <ElProgress percentage={percent} status={status} />
          </span>
        );
      },
    },
    {
      prop: 'size',
      label: '文件大小',
      width: 100,
      customRender: ({ text = 0 }) => {
        return text && `${(text / 1024).toFixed(2)}KB`;
      },
    },
    // {
    //   dataIndex: 'type',
    //   title: '文件类型',
    //   width: 100,
    // },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      customRender: ({ text }) => {
        if (text === UploadResultStatus.SUCCESS) {
          return <ElTag type="success">上传成功</ElTag>;
        } else if (text === UploadResultStatus.ERROR) {
          return <ElTag type="danger">上传失败</ElTag>;
        } else if (text === UploadResultStatus.UPLOADING) {
          return <ElTag>上传中</ElTag>;
        }

        return text;
      },
    },
  ];
}
export function createActionColumn(handleRemove: Function): FileBasicColumn {
  return {
    width: 120,
    label: '操作',
    prop: 'action',
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: '删除',
          type: 'danger',
          onClick: handleRemove.bind(null, record),
        },
      ];
      // if (checkImgType(record)) {
      //   actions.unshift({
      //     label: t('component.upload.preview'),
      //     onClick: handlePreview.bind(null, record),
      //   });
      // }
      return <TableAction actions={actions} outside={true} row={record} />;
    },
  };
}
// 文件预览列表
export function createPreviewColumns(): FileBasicColumn[] {
  return [
    {
      prop: 'url',
      label: '略缩图',
      width: 100,
      customRender: ({ record }) => {
        const { url } = (record as PreviewFileItem) || {};
        if (isImgTypeByName(url)) {
          return <ThumbUrl fileUrl={url} />;
        }
        return;
      },
    },
    {
      prop: 'name',
      label: '文件名',
      align: 'left',
    },
  ];
}

export function createPreviewActionColumn({
  handleRemove,
  handleDownload,
}: {
  handleRemove: Fn;
  handleDownload: Fn;
}): FileBasicColumn {
  return {
    width: 160,
    label: '操作',
    prop: 'action',
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: '删除',
          type: 'danger',
          onClick: handleRemove.bind(null, record),
        },
        {
          label: '下载',
          onClick: handleDownload.bind(null, record),
        },
      ];

      return <TableAction actions={actions} outside={true} row={record} />;
    },
  };
}
