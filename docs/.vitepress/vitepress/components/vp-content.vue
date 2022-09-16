<script setup lang="ts">
  import { computed, nextTick, onUpdated, ref, watch } from 'vue';
  // import nprogress from 'nprogress';
  import VPDocContent from './vp-doc-content.vue';

  const props = defineProps<{ isSidebarOpen: boolean }>();

  const shouldUpdateProgress = ref(true);

  watch(
    () => props.isSidebarOpen,
    (val) => {
      // delay the flag update since watch is called before onUpdated
      nextTick(() => {
        shouldUpdateProgress.value = !val;
      });
    }
  );

  onUpdated(() => {
    if (shouldUpdateProgress.value) {
      // nprogress.done();
    }
  });
</script>

<template>
  <main :class="{ 'page-content': true }">
    <VPDocContent>
      <template #content-top><slot name="content-top" /></template>
      <template #content-bottom><slot name="content-bottom" /></template>
    </VPDocContent>
  </main>
</template>
