<template>
  <div class="test-table-wrapper">
    <BasicTable @register="register" />
    <el-button @click="openModal(true)">asd</el-button>

    <BasicModal @register="registerModal">
      <BasicForm @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, getCurrentInstance } from 'vue';
  import { useGlobalConfig } from 'element-plus';
  import {
    BasicForm,
    BasicModal,
    BasicTable,
    useForm,
    useModal,
    useTable,
  } from '@p-helper/components';
  // TestTable

  const [register] = useTable({
    columns: [
      {
        prop: 'asd',
        label: '123',
      },
    ],
  });

  console.log('getCurrentInstance >--->', getCurrentInstance());
  console.log('useGlobalConfig >--->', useGlobalConfig());
  const [registerModal, { openModal }] = useModal();
  const [registerForm] = useForm({
    schemas: [
      {
        field: 'asd',
        label: 'ssss',
        component: 'DatePicker',
      },
    ],
  });
</script>

<style scoped>
  .test-table-wrapper {
    height: 100%;
  }
</style>
