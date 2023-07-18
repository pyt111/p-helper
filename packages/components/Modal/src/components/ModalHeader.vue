<template>
  <BasicTitle class="el-dialog__title" :helpMessage="helpMessage">
    {{ title }}
    <template v-if="subTitle">
      <el-divider direction="vertical" />
      <span class="sub-title">{{ subTitle }}</span>
    </template>
  </BasicTitle>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { BasicTitle } from '@p-helper/components/Basic';

  export default defineComponent({
    name: 'BasicModalHeader',
    components: { BasicTitle },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
      },
      title: { type: String },
      subTitle: { type: String },
    },
    emits: ['dblclick'],
  });
</script>
