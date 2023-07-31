<template>
  <div :class="[ns.b()]" class="table-icon-cell-wrapper">
    <slot>
      <div :class="ns.e('wrapper')">
        <Icon v-if="preIconValue" v-bind="IconPropsBind" :icon="preIconValue" />
        <span :class="ns.em('wrapper', 'text')">{{ props.cellText }}</span>
        <Icon
          v-if="suffixIconValue"
          v-bind="IconPropsBind"
          :icon="suffixIconValue"
        />
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { Icon } from '@p-helper/components/Icon';
  import { iconCellProps } from './props';

  // TableIconCell
  defineOptions({
    name: 'TableIconCell',
  });

  const props = defineProps(iconCellProps);

  const ns = useNamespace('icon-cell');

  // 规范化icon
  const normalizeIcon = (icon) => {
    if (!icon) {
      return '';
    }
    return icon.endsWith('|svg') ? icon : `${icon}|svg`;
  };

  const preIconValue = computed(() => normalizeIcon(props.icon));
  const suffixIconValue = computed(() => normalizeIcon(props.suffixIcon));

  const IconPropsBind = computed(() => {
    const { icon, suffixIcon, cellText, ...rest } = props;
    return rest;
  });
</script>
