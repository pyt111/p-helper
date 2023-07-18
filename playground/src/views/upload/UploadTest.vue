<template>
  <div class="upload-test-wrapper">
    <BasicUpload
      :accept="['image/*', '.xlsx']"
      :api="api"
      :max-number="1"
      show-preview
      empty-hide-preview
      upload-button-text="asd"
    />
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from 'vue';
  import { BasicUpload } from '@p-helper/components';
  // UploadTest
  defineOptions({
    name: 'UploadTest',
  });
  const api = async () => {
    return;
  };
</script>

<style scoped></style>
