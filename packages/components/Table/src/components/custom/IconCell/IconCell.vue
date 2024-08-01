<template>
  <div :class="[ns.b()]" class="table-icon-cell-wrapper" v-bind="$attrs">
    <slot>
      <div :class="ns.e('wrapper')">
        <ElText
          :class="ns.em('wrapper', 'text')"
          v-bind="props.componentProps?.elText"
        >
          <Icon
            v-if="preIconValue"
            v-bind="preIconPropsBind"
            :icon="preIconValue"
          />
          {{ props.componentProps?.label }}
          <Icon
            v-if="suffixIconValue"
            v-bind="suffixIconPropsBind"
            :icon="suffixIconValue"
          />
        </ElText>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { ElText } from 'element-plus';
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
      value: props.componentProps?.label,
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

    if (!iconStr) return '';
    return iconStr.endsWith('|svg') ? iconStr : `${iconStr}|svg`;
  };

  const preIconValue = computed(() =>
    normalizeIcon(props.componentProps?.preIcon)
  );

  const suffixIconValue = computed(() =>
    normalizeIcon(props.componentProps?.suffixIcon)
  );

  const preIconPropsBind = computed(() => {
    return props.componentProps?.preIconProps;
  });

  const suffixIconPropsBind = computed(() => {
    return props.componentProps?.suffixIconProps;
  });
</script>
