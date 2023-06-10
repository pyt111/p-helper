<template>
  <div class="play-split-pane-wrapper">
    <SplitPane class="play-split-pane">
      <SplitPaneItem class="item" size="1"> 122 </SplitPaneItem>
      <SplitPaneItem class="item" size="10"> 122 </SplitPaneItem>
      <SplitPaneItem class="item"> 233 </SplitPaneItem>
    </SplitPane>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from 'vue';
  // playSplitPane
  ['1'].includes('2');
</script>

<style scoped lang="scss">
  .play-split-pane-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .play-split-pane {
      width: 1000px;
      height: 80%;
      border: var(--p-border);
    }
  }
</style>
