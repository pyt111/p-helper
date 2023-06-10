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
  .basic-title {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    //color: var(--el-text-color-primary);
    user-select: none;

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      //background-color: @primary-color;
      content: '';
    }

    &-help {
      margin-left: 10px;
    }
  }
</style>
