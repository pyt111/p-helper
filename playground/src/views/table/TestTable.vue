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
  import { defineComponent } from 'vue';
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

  const [registerModal, { openModal }] = useModal();
  const [registerForm] = useForm({
    schemas: [
      {
        field: 'asd',
        label: 'ssss',
        component: 'Input',
      },
    ],
  });
</script>

<style scoped></style>
