<template>
  <div class="basic-upload">
    <el-space>
      <el-button
        :disabled="uploadDisabled"
        type="primary"
        class="basic-upload-upload-button"
        :icon="Upload"
        @click="onOpenUploadModal"
      >
        {{ uploadButtonText }}
      </el-button>
      <el-tooltip v-if="isShowPreview" placement="bottom">
        <template #content>
          已上传
          <template v-if="fileList.length">
            {{ fileList.length }}
          </template>
        </template>
        <el-button :icon="View" @click="openPreviewModal(true)">
          <template v-if="fileList.length && showPreviewNumber" #default>
            {{ fileList.length }}
          </template>
        </el-button>
      </el-tooltip>
    </el-space>
    <UploadModal
      v-bind="bindValue"
      :preview-file-list="fileList"
      @register="registerUploadModal"
      @change="handleChange"
      @delete="handleDelete"
    >
      <template #top>
        <slot name="modalTop" />
      </template>
      <template #bottom>
        <slot name="modalBottom" />
      </template>
    </UploadModal>

    <UploadPreviewModal
      :value="fileList"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
      @delete="handlePreviewDelete"
    />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref, watch } from 'vue';
  import { useModal } from '@p-helper/components/Modal';
  import { omit } from 'lodash-es';
  import { isArray } from '@p-helper/utils/is';
  import { Upload, View } from '@element-plus/icons-vue';
  import { uploadContainerProps } from './props';
  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';

  export default defineComponent({
    name: 'BasicUpload',
    // eslint-disable-next-line vue/no-unused-components
    components: { UploadModal, UploadPreviewModal },
    props: uploadContainerProps,
    emits: ['opened', 'change', 'delete', 'preview-delete', 'update:value'],

    setup(props, { emit, attrs }) {
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();

      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] =
        useModal();

      const fileList = ref<string[]>([]);

      const isShowPreview = computed(() => {
        const { emptyHidePreview, showPreview } = props;
        if (showPreview && !emptyHidePreview) return true;
        return showPreview && emptyHidePreview
          ? fileList.value.length > 0
          : false;
      });

      const bindValue = computed(() => {
        const value = { ...attrs, ...props };
        return omit(value, 'onChange');
      });

      watch(
        () => props.value,
        (value = []) => {
          fileList.value = isArray(value) ? value : [];
        },
        { immediate: true }
      );

      // 上传modal保存操作
      function handleChange(urls: string[], fileListValue) {
        fileList.value = [...unref(fileList), ...(urls || [])];
        emit('update:value', fileList.value);
        emit('change', fileList.value, fileListValue);
      }

      // 预览modal保存操作
      function handlePreviewChange(urls: string[]) {
        fileList.value = [...(urls || [])];
        emit('update:value', fileList.value);
        emit('change', fileList.value);
      }

      function handleDelete(record: Recordable<any>) {
        emit('delete', record);
      }

      function handlePreviewDelete(url: string) {
        emit('preview-delete', url);
      }

      const onOpenUploadModal = () => {
        openUploadModal(true).then(() => {
          emit('opened');
        });
      };

      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        handlePreviewChange,
        registerPreviewModal,
        openPreviewModal,
        fileList,
        isShowPreview,
        bindValue,
        handleDelete,
        handlePreviewDelete,
        View,
        Upload,
        onOpenUploadModal,
      };
    },
  });
</script>
