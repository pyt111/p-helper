<template>
  <span :class="getClass">
    <slot />
    <!--    <BasicHelp v-if="helpMessage" :class="`${prefixCls}-help`" :text="helpMessage" />-->
  </span>
</template>
<script lang="ts" setup>
  import { computed, useSlots } from 'vue';
  // import BasicHelp from './BasicHelp.vue';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import type { PropType } from 'vue';

  const props = defineProps({
    /**
     * Help text list or string
     * @default: ''
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * Whether the color block on the left side of the title
     * @default: false
     */
    span: { type: Boolean },
    /**
     * Whether to default the text, that is, not bold
     * @default: false
     */
    normal: { type: Boolean },
  });

  const { prefixCls } = useDesign('basic-title');
  const slots = useSlots();
  const getClass = computed(() => [
    prefixCls,
    { [`${prefixCls}-show-span`]: props.span && slots.default },
    { [`${prefixCls}-normal`]: props.normal },
  ]);
</script>
<style lang="scss">

</style>
