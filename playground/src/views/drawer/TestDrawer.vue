<template>
  <div class="test-drawer-wrapper">
    <div class="test-drawer-inner-wrapper-1">
      <BasicDrawer
        class="test-drawer"
        title="头部"
        in-container
        :is-detail="true"
        :modal="false"
        @register="register"
      >
        1
      </BasicDrawer>
    </div>
    <div class="test-drawer-inner-wrapper-2" />
    <el-button @click="openDrawer(true)">打开</el-button>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from 'vue';
  import { BasicDrawer, useDrawer } from '@p-helper/components/Drawer';
  // TestDrawer
  defineOptions({
    name: 'TestDrawer',
  });

  const [register, { openDrawer }] = useDrawer();
</script>

<style scoped lang="scss">
  .test-drawer-inner-wrapper-1 {
    width: 80vh;
    height: 500px;
    position: relative;
    background-color: #79bbff;
  }
  .test-drawer-inner-wrapper-2 {
    margin-top: 30px;
    width: 80vh;
    height: 500px;
    position: relative;
    background-color: #686641;
  }
</style>
