<template>
  <div class="custom-node-wrapper">
    <div>{{ node.data?.title }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, onMounted, ref } from 'vue';
  // CustomNode

  defineOptions({
    name: 'CustomNode',
  });
  const node = ref({});

  const getNode = inject<Function>('getNode');

  onMounted(() => {
    // const child1 = graph.addNode({
    //   x: 110,
    //   y: 80,
    //   width: 100,
    //   height: 50,
    //   label: 'Child\n(inside)',
    //   zIndex: 10,
    //   attrs: {
    //     body: {
    //       stroke: 'none',
    //       fill: '#3199FF',
    //     },
    //     label: {
    //       fill: '#fff',
    //       fontSize: 12,
    //     },
    //   },
    // });
    node.value = getNode?.();
    // console.log('node >--->', node);
  });
</script>

<style scoped>
  .custom-node-wrapper {
    //width: 1000px;
    height: 100%;
    border: 1px solid #c1cfe1;
  }
</style>
