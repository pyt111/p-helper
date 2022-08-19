<template>
  <div class="waterfall-wrapper">waterfall</div>
</template>

<script lang="ts" setup>
import { waterfallProps } from './waterfall';
defineOptions({
  name: 'PWaterfall',
});
const props = defineProps(waterfallProps);

console.log('props >--->', props);
</script>

<style scoped></style>
