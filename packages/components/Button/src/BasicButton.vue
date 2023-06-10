<template>
  <el-button
    :class="getButtonClass"
    type="primary"
    v-bind="getBindValue"
    @click="props.onClick"
  >
    <template #default="data">
      <Icon v-if="props.preIcon" :icon="props.preIcon" :size="props.iconSize" />
      <slot v-bind="data || {}" />
      <Icon
        v-if="props.postIcon"
        :icon="props.postIcon"
        :size="props.iconSize"
      />
    </template>
  </el-button>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import Icon from '@p-helper/components/Icon/src/Icon.vue';
  import { useAttrs } from '@p-helper/hooks/core/useAttrs';
  import { buttonProps } from './props';

  defineOptions({
    name: 'AButton',
    inheritAttrs: false,
  });
  const props = defineProps(buttonProps);
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      {
        [`yee-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });

  // get inherit binding value
  const getBindValue = computed(() => ({
    ...unref(attrs),
    ...props,
    icon: props.elIcon,
  }));
</script>
