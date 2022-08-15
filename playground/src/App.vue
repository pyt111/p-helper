<template>
  <div> test {{ num }} </div>
  <TestComponent />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import { TestComponent } from '@p-helper/components'
// import TestComponent from '@p-helper/boundary-drag';

export default defineComponent({
  name: 'AppRoot',
  // components: {
  //   TestComponent,
  // },
  setup() {
    const num = ref(1);

    return {
      num,
    }
  },
})
</script>
