<template>
  <div> provide-test: {{ test }} </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue';

  const test = inject('table');
</script>

<style scoped></style>
