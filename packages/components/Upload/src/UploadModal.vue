<template>
  <BasicModal
    width="800px"
    title="上传"
    ok-text="保存"
    max-height="50vh"
    view-style="min-height: 200px;"
    v-bind="$attrs"
    :close-func="handleCloseFunc"
    :mask-closable="false"
    :keyboard="false"
    class="upload-modal"
    :ok-button-props="getOkButtonProps"
    :cancel-button-props="{ disabled: isUploadingRef }"
    @register="register"
    @ok="handleOk"
  >
    <template #centerFooter>
      <el-button
        type="primary"
        :disabled="!getIsSelectFile"
        :loading="isUploadingRef"
        @click="handleStartUpload"
      >
        {{ getUploadBtnText }}
      </el-button>
    </template>

    <slot name="top" />
    <div class="upload-modal-toolbar">
      <ElAlert
        :description="getHelpText"
        type="info"
        banner
        show-icon
        :closable="false"
        class="upload-modal-toolbar__text"
      />

      <ElUpload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :show-file-list="false"
        class="upload-modal-toolbar__btn"
      >
        <el-button type="primary" size="default"> 选择文件 </el-button>
      </ElUpload>
    </div>
    <FileList
      :data-source="fileListRef"
      :columns="columns"
      :action-column="actionColumn"
    />
    <slot name="bottom" />
  </BasicModal>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, ref, toRefs, unref } from 'vue';
  import { isPromise } from '@vue/shared';
  import { ElAlert, ElButton, ElMessage, ElUpload } from 'element-plus';
  import { BasicModal, useModalInner } from '@p-helper/components/Modal';
  // hooks
  //   types
  import { buildUUID } from '@p-helper/utils/uuid';
  import { isFunction } from '@p-helper/utils/is';
  import { warn } from '@p-helper/utils/log';
  import { noop } from 'lodash-es';
  import { UploadResultStatus } from './typing';
  import { basicProps } from './props';
  import { createActionColumn, createTableColumns } from './data';
  // utils
  import { checkImgType, getBase64WithFile } from './helper';
  import { useUploadType } from './useUpload';
  import FileList from './FileList.vue';
  import type { FileItem } from './typing';
  import type { PropType } from 'vue';

  export default defineComponent({
    components: { BasicModal, ElUpload, ElAlert, FileList, ElButton },
    props: {
      ...basicProps,
      previewFileList: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    emits: ['change', 'register', 'delete'],
    setup(props, { emit }) {
      const state = reactive<{ fileList: FileItem[] }>({
        fileList: [],
      });

      //   是否正在上传
      const isUploadingRef = ref(false);
      const fileListRef = ref<FileItem[]>([]);
      const { accept, helpText, maxNumber, maxSize } = toRefs(props);

      const [register, { closeModal }] = useModalInner();

      const { getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      const getIsSelectFile = computed(() => {
        return (
          fileListRef.value.length > 0 &&
          !fileListRef.value.every(
            (item) => item.status === UploadResultStatus.SUCCESS
          )
        );
      });

      const getOkButtonProps = computed(() => {
        const someSuccess = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.SUCCESS
        );
        return {
          disabled:
            isUploadingRef.value ||
            fileListRef.value.length === 0 ||
            !someSuccess,
        };
      });

      const getUploadBtnText = computed(() => {
        const someError = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.ERROR
        );
        return isUploadingRef.value
          ? '上传中'
          : someError
          ? '重新上传失败文件'
          : '开始上传';
      });

      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize } = props;
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          ElMessage.error(`只能上传不超过${maxSize}MB的文件!`);
          return false;
        }

        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };
        // 生成图片缩略图
        if (checkImgType(file)) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                thumbUrl,
                ...commonItem,
              },
            ];
          });
        } else {
          fileListRef.value = [...unref(fileListRef), commonItem];
        }
        return false;
      }

      // 删除
      function handleRemove(record: FileItem) {
        const index = fileListRef.value.findIndex(
          (item) => item.uuid === record.uuid
        );
        index !== -1 && fileListRef.value.splice(index, 1);
        emit('delete', record);
      }

      // 预览
      // function handlePreview(record: FileItem) {
      //   const { thumbUrl = '' } = record;
      //   createImgPreview({
      //     imageList: [thumbUrl],
      //   });
      // }

      async function uploadApiByItem(item: FileItem) {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('上传api必须存在并且是一个函数');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;
          const ret = await props.api?.(
            {
              data: {
                ...(props.uploadParams || {}),
              },
              file: item.file,
              name: props.name,
              filename: props.filename,
            },
            (progressEvent: ProgressEvent) => {
              const complete =
                ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            }
          );
          const { data } = ret;
          item.status = UploadResultStatus.SUCCESS;
          item.responseData = data;
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      // 点击开始上传
      async function startUpload() {
        const { maxNumber } = props;
        if (
          (fileListRef.value.length + props.previewFileList?.length ?? 0) >
          maxNumber
        ) {
          return ElMessage.warning(`最多只能上传${maxNumber}个文件`);
        }
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          const uploadFileList =
            fileListRef.value.filter(
              (item) => item.status !== UploadResultStatus.SUCCESS
            ) || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            })
          );
          isUploadingRef.value = false;
          // 生产环境:抛出错误
          const errorList = data.filter((item: any) => !item.success);
          if (errorList.length > 0) throw errorList;
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }

      const handleStartUpload = async (file) => {
        if (props.beforeUpload) {
          let pass;
          pass = props.beforeUpload(file, fileListRef.value);

          if (isPromise(pass)) {
            pass = await pass.catch(noop);
          }

          if (!pass) return false;
        }
        await startUpload().catch(noop);
      };

      //   点击保存
      function handleOk() {
        const { maxNumber } = props;

        if (fileListRef.value.length > maxNumber) {
          return ElMessage.warning(`最多只能上传${maxNumber}个文件`);
        }
        if (isUploadingRef.value) {
          return ElMessage.warning(`请等待文件上传后，保存!`);
        }
        const fileList: string[] = [];

        console.log('fileListRef >--->', fileListRef.value);
        for (const item of fileListRef.value) {
          const { status, responseData } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            fileList.push(responseData.url);
          }
        }
        // 存在一个上传成功的即可保存
        if (fileList.length <= 0) {
          return ElMessage.warning('没有上传成功的文件，无法保存!');
        }
        closeModal();
        emit('change', fileList, unref(fileListRef));
        fileListRef.value = [];
      }

      // 点击关闭：则所有操作不保存，包括上传的
      async function handleCloseFunc() {
        if (!isUploadingRef.value) {
          fileListRef.value = [];
          return true;
        } else {
          ElMessage.warning('请等待文件上传结束后操作');
          return false;
        }
      }

      return {
        columns: createTableColumns(),
        actionColumn: createActionColumn(handleRemove),
        register,
        closeModal,
        getHelpText,
        getStringAccept,
        getOkButtonProps,
        beforeUpload,
        // registerTable,
        fileListRef,
        state,
        isUploadingRef,
        handleStartUpload,
        handleOk,
        handleCloseFunc,
        getIsSelectFile,
        getUploadBtnText,
      };
    },
  });
</script>
