<template>
  <el-button
    :class="getButtonClass"
    type="primary"
    v-bind="getBindValue"
    @click="props.onClick"
  >
    <template #default="data">
      <ActionIcon
        v-if="props.preIcon"
        :order="props.label ? 'pre' : ''"
        :icon="props.preIcon"
        :icon-size="props.iconSize"
        :color="props.color"
        v-bind="props.preIconProps"
      />
      <slot v-bind="data || {}" />
      <ActionIcon
        v-if="props.suffixIcon"
        :order="props.label ? 'suffix' : ''"
        :icon="props.suffixIcon"
        :icon-size="props.iconSize"
        :color="props.color"
        v-bind="props.suffixIconProps"
      />
    </template>
  </el-button>
</template>
<script lang="ts" setup>
  import { computed, toRaw, unref } from 'vue';
  import { useAttrs } from '@p-helper/hooks/core/useAttrs';
  import { ElButton } from 'element-plus';
  import { buttonProps } from './props';
  import { ActionIcon } from './ActionIcon';

  defineOptions({
    name: 'BasicButton',
    inheritAttrs: false,
  });
  const props = defineProps(buttonProps);
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { colorClassName, disabled } = props;
    return [
      {
        'basic-button': true,
        [`yee-btn-${colorClassName}`]: !!colorClassName,
        [`is-disabled`]: disabled,
      },
    ];
  });

  const getBindValue = computed(() => ({
    ...unref(attrs),
    ...unref(props),
    icon: toRaw(props.elIcon),
  }));
</script>
