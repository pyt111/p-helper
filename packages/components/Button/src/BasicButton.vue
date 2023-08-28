<template>
  <el-button
    :class="getButtonClass"
    type="primary"
    v-bind="getBindValue"
    @click="props.onClick"
  >
    <template #default="data">
      <ActionIcon
        v-if="preIconValue"
        name="pre"
        :icon="preIconValue"
        :icon-size="props.iconSize"
        :color="props.color"
      />
      <slot v-bind="data || {}" />
      <ActionIcon
        v-if="suffixIconValue"
        name="suffix"
        :icon="suffixIconValue"
        :icon-size="props.iconSize"
        :color="props.color"
      />
    </template>
  </el-button>
</template>
<script lang="ts" setup>
  import { computed, h, toRaw, unref } from 'vue';
  import Icon from '@p-helper/components/Icon/src/Icon.vue';
  import { useAttrs } from '@p-helper/hooks/core/useAttrs';
  import { ElButton, ElIcon } from 'element-plus';
  import { isObject } from 'lodash-es';
  import { buttonProps } from './props';
  import { ActionIcon } from './ActionIcon';

  defineOptions({
    name: 'PButton',
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
  // 规范化icon
  const normalizeIcon = (icon) => {
    if (!icon) {
      return;
    }
    if (isObject(icon)) {
      return toRaw(icon);
    }
    const iconStr = icon;
    return iconStr.endsWith('|svg') ? iconStr : `${iconStr}|svg`;
  };

  const preIconValue = computed(() => normalizeIcon(props.preIcon));
  const suffixIconValue = computed(() => normalizeIcon(props.suffixIcon));

  const getBindValue = computed(() => ({
    ...unref(attrs),
    ...unref(props),
    icon: toRaw(props.elIcon),
  }));
</script>
