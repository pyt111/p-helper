<template>
  <!--  <div> test {{ num }} </div>-->
  <!--  <TestComponent />-->

  <ProvideComponent />
  <button @click="onChange">切换</button>
  <div>
    {{ state.currentTab }}
  </div>
  <div>recordCount: {{ state.recordCount }}</div>
</template>

<script lang="ts">
  import { defineComponent, provide, reactive } from 'vue';
  import ProvideComponent from './components/provide-test';

  export default defineComponent({
    name: 'AppRoot',
    components: {
      ProvideComponent,
    },
    setup() {
      const state = reactive({
        recordCount: 0,
        currentTab: '',
      });

      // 这里注入
      provide('table', state);

      const onChange = () => {
        state.recordCount += 1;
        state.currentTab = `我是tab---${state.recordCount}`;
      };

      return {
        state,
        onChange,
      };
    },
  });
</script>
