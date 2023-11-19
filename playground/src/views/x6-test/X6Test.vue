<template>
  <div class="x6-test-wrapper">
    <BasicX6 @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from 'vue';
  import { BasicX6, useX6 } from '@p-helper/components';

  defineOptions({
    name: 'X6Test',
  });

  const [register] = useX6({});
</script>

<style scoped></style>
