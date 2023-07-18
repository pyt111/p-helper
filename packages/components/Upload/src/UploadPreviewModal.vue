<template>
  <BasicModal
    width="800px"
    title="预览"
    class="upload-preview-modal"
    v-bind="$attrs"
    :show-ok-btn="false"
    @register="register"
  >
    <FileList
      :data-source="fileListRef"
      :columns="columns"
      :action-column="actionColumn"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  //   import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '@p-helper/components/Modal';
  import { downloadByUrl } from '@p-helper/utils/file/download';
  import { isArray } from '@p-helper/utils/is';
  import FileList from './FileList.vue';
  import { previewProps } from './props';
  import { createPreviewActionColumn, createPreviewColumns } from './data';
  import type { PreviewFileItem } from './typing';

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();

      const fileListRef = ref<PreviewFileItem[]>([]);
      watch(
        () => props.value,
        (value) => {
          if (!isArray(value)) value = [];
          fileListRef.value = value
            .filter((item) => !!item)
            .map((item) => {
              return {
                url: item,
                type: item.split('.').pop() || '',
                name: item.split('/').pop() || '',
              };
            });
        },
        { immediate: true }
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex(
          (item) => item.url === record.url
        );
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].url);
          emit(
            'list-change',
            fileListRef.value.map((item) => item.url)
          );
        }
      }

      // // 预览
      // function handlePreview(record: PreviewFileItem) {
      //   const { url = '' } = record;
      //   createImgPreview({
      //     imageList: [url],
      //   });
      // }

      // 下载
      function handleDownload(record: PreviewFileItem) {
        const { url = '' } = record;
        downloadByUrl({ url });
      }

      return {
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns(),
        actionColumn: createPreviewActionColumn({
          handleRemove,
          handleDownload,
        }),
      };
    },
  });
</script>
