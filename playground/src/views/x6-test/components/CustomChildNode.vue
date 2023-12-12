<template>
  <div
    class="custom-child-node-wrapper"
    :style="{ opacity: data.opacity || 1 }"
  >
    <div class="title">
      {{ data?.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, onMounted, ref } from 'vue';
  import type { Node } from '@antv/x6/src/model/node';
  // CustomChildNode

  defineOptions({
    name: 'CustomChildNode',
  });
  const data = ref({});
  const getNode = inject<Function>('getNode');

  onMounted(() => {
    const node = getNode?.() as Node;
    console.log('node >--->', node);
    data.value = node.data || {};
    node.on('change:data', ({ current }) => {
      data.value = current;
    });
    // console.log('node >--->', node.value);
    // console.log('child node >--->', node.value);
    // console.log('node >--->', node);
  });
</script>

<style scoped>
  .custom-child-node-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #409eff;
    background-color: #409eff;
    border-radius: 3px;
    color: #fff;
    padding: 5px 10px;
  }
</style>
