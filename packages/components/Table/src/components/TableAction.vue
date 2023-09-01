<template>
  <div :class="[prefixCls, getAlign]">
    <template v-for="(action, i) in getActions" :key="`${i}-${action.label}`">
      <el-tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <DropdownItemContent :action="action">
          <template v-if="action.label">{{ action.label }}</template>
        </DropdownItemContent>
      </el-tooltip>
      <DropdownItemContent v-else :action="action">
        <template v-if="action.label">{{ action.label }}</template>
      </DropdownItemContent>
      <el-divider
        v-if="(divider || action.divider) && i < getActions.length - 1"
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
      <el-button v-if="!$slots.more" text type="primary" class="button-more">
        {{ dropDownButtonText }}
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { computed, toRaw, unref } from 'vue';
  import { isBoolean, isFunction, isString } from '@p-helper/utils/is';
  import { propTypes } from '@p-helper/utils/propTypes';
  import { useTableContext } from '@p-helper/components/Table/src/hooks/useTableContext';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { ACTION_COLUMN_FLAG } from '@p-helper/components/Table/src/const';
  import { Dropdown, DropdownItemContent } from '@p-helper/components/Dropdown';
  import { omit } from 'lodash-es';
  import { MoreFilled } from '@element-plus/icons-vue';
  import type { PropType } from 'vue';
  import type {
    EditRowRecordRow,
    TableActionParams,
  } from '@p-helper/components/Table/src/components/editable';
  import type { TableActionType } from '@p-helper/components/Table/src/types/table';
  import type { ActionItem } from '../types/tableAction';
  import type { ElTooltipProps } from 'element-plus';

  defineOptions({
    name: 'TableAction',
  });

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
      type: Object as PropType<EditRowRecordRow>,
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
    return actionColumn?.align;
  });

  const getemitParams = computed<TableActionParams>(() => {
    return {
      row: props.row,
      index: props.index,
      record: props.record,
    };
  });

  const genPublicProps = (
    action: ActionItem,
    emitParams: TableActionParams
  ) => {
    const { popConfirm, onClick } = action;
    const propsActions = omit(action, 'ifShow');
    return {
      link: true,
      bg: false,
      ...propsActions,
      popConfirm: {
        ...popConfirm,
        onConfirm: popConfirm?.confirm.bind(null, emitParams),
        onCancel: popConfirm?.cancel?.bind(null, emitParams),
      },
      onClick: onClick?.bind(null, emitParams),
      enablePopConfirm: !!popConfirm,
      updateIndex: props.record?.updateIndex?.value,
    };
  };

  const getActions = computed(() => {
    const emitParams = unref(getemitParams);
    return (toRaw(props.actions) || [])
      .filter((action) => {
        return isIfShow(action);
      })
      .map((action) => {
        const publicProps = genPublicProps(action, emitParams);

        return {
          getPopupContainer: () =>
            unref((table as any)?.wrapRef.value) ?? document.body,
          ...publicProps,
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

  const getDropdownList = computed((): ActionItem[] => {
    const emitParams = unref(getemitParams);

    const list = (toRaw(props.dropDownActions) || []).filter((action) => {
      return isIfShow(action);
    });
    return list.map((action, index) => {
      const publicProps = genPublicProps(action, emitParams);

      return {
        icon: toRaw(action.icon || action.elIcon),
        type: 'default',
        divider: index < list.length - 1 ? props.divider : false,
        ...publicProps,
      } as ActionItem;
    });
  });
</script>
