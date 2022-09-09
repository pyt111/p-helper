<template>
  <router-view v-slot="{ Component, route }">
    <transition appear mode="out-in" name="fade-transform">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AppRoot',
    setup() {
      return {};
    },
  });
</script>
