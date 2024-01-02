<template>
  <div class="upload-test-wrapper">
    <BasicUpload
      :accept="['image/*', '.xlsx']"
      :api="api"
      :max-number="1"
      show-preview
      empty-hide-preview
      upload-button-text="asd"
      destroy-on-close
      :before-upload="beforeUpload"
      @opened="onOpened"
    >
      <template #modalTop>
        <BasicForm @register="registerForm" @submit="onSubmit" />
      </template>
      <template #modalBottom> 222 </template>
    </BasicUpload>
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
  const [registerForm, { getFieldsValue, setFieldsValue, validateField }] =
    useForm({
      schemas: [
        {
          label: 'Krb5 File',
          field: 'uploadSrc',
          valueField: 'value',
          component: 'Upload',
          componentProps: {
            api,
            showPreview: true,
            previewProps: {
              showActionColumn: false,
            },
            // fileListProps: {
            //   actionColumn: null,
            // },
            onChange(urls, fileList) {
              console.log('val >--->', urls, fileList);
            },
          },
        },
        {
          label: '测试异步设置',
          field: 'ft',
          component: 'Input',
          required: true,
        },
      ],
    });

  const onOpened = () => {
    setFieldsValue({
      uploadSrc: 'asdasd',
    });
  };

  const beforeUpload = async (file) => {
    const verification = await validateField(['ft']).catch(() => {
      console.log('dddd >--->');
    });
    console.log('verification >--->', verification);
    return verification;
  };
  const onSubmit = () => {
    console.log('getFieldsValue >--->', getFieldsValue());
  };
</script>

<style scoped></style>
