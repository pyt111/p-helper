<template>
  <div class="app-wrapper">
    app-wrapper
    <VpContent />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import VpContent from '~/components/vp-content.vue';

  export default defineComponent({
    name: 'App',
    components: { VpContent },
    setup() {
      return {};
    },
  });
</script>

<style scoped></style>
