<template>
  <div id="basic-x6-wrapper" ref="x6ContentRef" class="basic-x6-wrapper">
    {{ propsRef.a }}
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { deepMerge } from '@p-helper/utils';
  import { Graph } from '@antv/x6';
  import { basicFormEmits } from './props';
  import type { X6Methods } from './types/hooks';
  import type { X6Props } from './types/props';

  defineOptions({
    name: 'BasicX6',
  });

  const x6ContentRef = ref();
  const graphInstance = ref<Graph>();

  const emit = defineEmits(basicFormEmits);
  const propsRef = ref<Partial<X6Props>>({});

  async function setProps(formProps: Partial<X6Props>): Promise<void> {
    propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
  }
  function getGraphInstance() {
    return graphInstance.value!;
  }

  const actions: X6Methods = {
    setProps,
    getGraphInstance,
  };

  onMounted(() => {
    graphInstance.value = new Graph({
      container: document.getElementById('basic-x6-wrapper')!,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    });
    emit('register', actions);
  });
</script>
