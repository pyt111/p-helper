<template>
  <div>
    <slot name="insertFooter" />
    <el-button
      v-if="showCancelBtn"
      plain
      v-bind="cancelButtonProps"
      @click="handleCancel"
    >
      {{ cancelText }}
    </el-button>
    <slot name="centerFooter" />
    <el-button
      v-if="showOkBtn"
      :loading="confirmLoading"
      :type="okType"
      v-bind="okButtonProps"
      @click="handleOk"
    >
      {{ okText }}
    </el-button>
    <slot name="appendFooter" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { basicProps } from '../props';
  export default defineComponent({
    name: 'BasicModalFooter',
    props: basicProps,
    emits: ['ok', 'cancel'],
    setup(_, { emit }) {
      function handleOk(e: Event) {
        emit('ok', e);
      }

      function handleCancel(e: Event) {
        emit('cancel', e);
      }

      return { handleOk, handleCancel };
    },
  });
</script>
