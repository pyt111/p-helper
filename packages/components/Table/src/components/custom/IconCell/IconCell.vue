<template>
  <div :class="[ns.b()]" class="table-icon-cell-wrapper" v-bind="$attrs">
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
  import { computed, unref, useAttrs } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { Icon } from '@p-helper/components/Icon';
  import { isFunction } from 'lodash-es';
  import { iconCellProps } from './props';
  import type { TableCustomCellParams } from '../../../props';

  // TableIconCell
  defineOptions({
    name: 'TableIconCell',
  });

  const ns = useNamespace('icon-cell');
  const props = defineProps(iconCellProps);

  const iconCellCallParams = computed<TableCustomCellParams>(() => {
    return {
      row: props.row as Record<string, any>,
      elColumn: props.elColumn as Record<string, any>,
      index: props.index as number,
      value: props.cellText,
    };
  });

  // 规范化icon
  const normalizeIcon = (icon) => {
    if (!icon) {
      return '';
    }
    let iconStr = icon;
    if (isFunction(icon)) {
      iconStr = icon(unref(iconCellCallParams));
    }
    return iconStr.endsWith('|svg') ? iconStr : `${iconStr}|svg`;
  };

  const preIconValue = computed(() => normalizeIcon(props.icon));
  const suffixIconValue = computed(() => normalizeIcon(props.suffixIcon));

  const IconPropsBind = computed(() => {
    const {
      icon,
      suffixIcon,
      cellText,
      row,
      componentProps,
      component,
      elColumn,
      record,
      ...rest
    } = props;
    return rest;
  });
</script>
