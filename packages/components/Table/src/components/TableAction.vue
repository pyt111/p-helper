<template>
  <div :class="[prefixCls, getAlign]">
    <template
      v-for="(action, index) in getActions"
      :key="`${index}-${action.label}`"
    >
      <el-tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <PopConfirmButton v-bind="action">
          <Icon
            v-if="action.icon"
            :class="{ 'mr-1': !!action.label }"
            :icon="action.icon"
          />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmButton>
      </el-tooltip>
      <PopConfirmButton v-else v-bind="action">
        <Icon
          v-if="action.icon"
          :class="{ 'mr-1': !!action.label }"
          :icon="action.icon"
        />
        <template v-if="action.label">{{ action.label }}</template>
      </PopConfirmButton>
      <el-divider
        v-if="(divider || action.divider) && index < getActions.length - 1"
        class="action-divider"
        direction="vertical"
      />
    </template>
    <el-divider
      v-if="
        divider &&
        getActions.length &&
        getDropdownList &&
        getDropdownList.length
      "
      class="action-divider"
      direction="vertical"
    />
    <Dropdown
      v-if="dropDownActions && getDropdownList.length > 0"
      :drop-menu-list="getDropdownList"
      :hide-on-click="false"
      popconfirm
      trigger="click"
    >
      <slot name="more" />
      <el-button
        v-if="!$slots.more"
        size="small"
        text
        type="primary"
        class="button-more"
      >
        {{ dropDownButtonText }}
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup name="TableAction">
  import { computed, toRaw, unref } from 'vue';
  import Icon from '@p-helper/components/Icon';
  import { PopConfirmButton } from '@p-helper/components/Button';
  import { isBoolean, isFunction, isString } from '@p-helper/utils/is';
  import { propTypes } from '@p-helper/utils/propTypes';
  import { useTableContext } from '@p-helper/components/Table/src/hooks/useTableContext';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { ACTION_COLUMN_FLAG } from '@p-helper/components/Table/src/const';
  import { Dropdown } from '@p-helper/components/Dropdown';
  import { MoreFilled } from '@element-plus/icons-vue';
  import type { EditRecordRow } from '@p-helper/components/Table/src/components/editable';
  import type { TableActionType } from '@p-helper/components/Table/src/types/table';
  import type { ActionItem } from '../types/tableAction';
  import type { ElTooltipProps } from 'element-plus';

  const props = defineProps({
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    dropDownButtonText: {
      type: String,
      default: '',
    },
    outside: propTypes.bool,
    row: {
      type: Object as PropType<any>,
      default: () => ({} as Record<string, any>),
    },
    index: {
      type: Number,
      default: -1,
    },
    record: {
      type: Object as PropType<EditRecordRow>,
      default: () => ({}),
    },
    divider: propTypes.bool.def(false),
  });

  let table: Partial<TableActionType> = {};
  if (!props.outside) {
    table = useTableContext();
  }

  const { prefixCls } = useDesign('basic-table-action');

  const getAlign = computed(() => {
    const columns = (table as TableActionType)?.getColumns?.() || [];
    const actionColumn = columns.find(
      (item) => item.flag === ACTION_COLUMN_FLAG
    );
    return actionColumn?.align ?? 'center';
  });

  const getemitParams = computed(() => {
    return {
      row: props.row,
      index: props.index,
      record: props.record,
    };
  });

  const getActions = computed(() => {
    const emitParams = unref(getemitParams);

    return (toRaw(props.actions) || [])
      .filter((action) => {
        return isIfShow(action);
      })
      .map((action) => {
        const { popConfirm, onClick } = action;

        return {
          getPopupContainer: () =>
            unref((table as any)?.wrapRef.value) ?? document.body,
          link: true,
          bg: false,
          size: 'small',
          ...action,
          ...(popConfirm || {}),
          onClick: onClick?.bind(null, emitParams),
          onConfirm: popConfirm?.confirm.bind(null, emitParams),
          onCancel: popConfirm?.cancel?.bind(null, emitParams),
          enable: !!popConfirm,
        } as ActionItem;
      });
  });

  function isIfShow(action: ActionItem): boolean {
    const ifShow = action.ifShow;
    const emitParams = unref(getemitParams);

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(action, emitParams);
    }
    return isIfShow;
  }

  function getTooltip(
    data: any | string | ElTooltipProps
  ): Partial<ElTooltipProps> {
    return {
      getPopupContainer: () =>
        unref((table as any)?.wrapRef.value) ?? document.body,
      placement: 'bottom',
      ...(isString(data) ? { content: data } : data),
    };
  }

  const getDropdownList = computed((): any[] => {
    const emitParams = unref(getemitParams);

    const list = (toRaw(props.dropDownActions) || []).filter((action) => {
      return isIfShow(action);
    });
    return list.map((action, index) => {
      const { label, popConfirm, onClick } = action;
      return {
        ...action,
        ...(popConfirm || {}),
        onClick: onClick?.bind(null, emitParams),
        onConfirm: popConfirm?.confirm.bind(null, emitParams),
        onCancel: popConfirm?.cancel?.bind(null, emitParams),
        text: label,
        divider: index < list.length - 1 ? props.divider : false,
      };
    });
  });
</script>

<style scoped lang="scss">
  $prefix-cls: #fff;
  .basic-table-action {
    color: $prefix-cls;
    display: flex;
    align-items: center;

    .action-divider {
      display: table;
    }

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    .button-more {
      padding: 0;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
    }
  }
</style>
