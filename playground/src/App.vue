<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component, route }">
      <transition appear mode="out-in" name="fade-transform">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';

  export default defineComponent({
    name: 'AppRoot',
    setup() {
      return {
        zhCn,
      };
    },
  });
</script>
