<template>
  <div class="upload-test-wrapper">
    <BasicForm @register="registerForm" @submit="onSubmit" />
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
  import { BasicForm, BasicUpload, useForm } from '@p-helper/components';
  // UploadTest
  defineOptions({
    name: 'UploadTest',
  });

  const api = async () => {
    return {
      data: {
        url: 'sss',
      },
    };
  };
  const [registerForm, { getFieldsValue }] = useForm({
    schemas: [
      {
        label: 'Krb5 File',
        field: 'uploadSrc',
        component: 'Upload',
        componentProps: {
          api,
          showPreview: true,
          onChange(urls, fileList) {
            console.log('val >--->', urls, fileList);
          },
        },
      },
    ],
  });

  const onSubmit = () => {
    console.log('getFieldsValue >--->', getFieldsValue());
  };
</script>

<style scoped></style>
