<template>
  <div class="basic-x6-wrapper" />
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { deepMerge } from '@p-helper/utils';
  import { basicFormEmits } from './props';
  import type { X6Methods, X6Props } from './typing';

  defineOptions({
    name: 'BasicX6',
  });

  const emit = defineEmits(basicFormEmits);
  const propsRef = ref<Partial<X6Props>>({});

  async function setProps(formProps: Partial<X6Props>): Promise<void> {
    propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
  }

  const actions: X6Methods = {
    setProps,
  };

  onMounted(() => {
    emit('register', actions);
  });
</script>

<style scoped></style>
