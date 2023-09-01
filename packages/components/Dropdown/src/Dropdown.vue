<template>
  <el-dropdown ref="dropdownRef" :trigger="trigger" v-bind="$attrs">
    <span>
      <slot />
    </span>
    <template #dropdown>
      <el-dropdown-menu class="basic-table-action-pop-confirm">
        <template v-for="item in dropMenuList" :key="`${item.label}`">
          <el-dropdown-item v-bind="getBindValues(item)" @click="onClose(item)">
            <el-popconfirm
              v-if="popconfirm && item.enablePopConfirm"
              v-bind="item.popConfirm"
            >
              <template #reference>
                <div class="trigger-item">
                  <DropdownItemContent :action="getBindItemContentValues(item)">
                    <template v-if="item.label">{{ item.label }}</template>
                  </DropdownItemContent>
                </div>
              </template>
            </el-popconfirm>
            <template v-else>
              <DropdownItemContent :action="getBindItemContentValues(item)">
                <template v-if="item.label">{{ item.label }}</template>
              </DropdownItemContent>
            </template>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { omit } from 'lodash-es';
  import DropdownItemContent from './DropdownItemContent';
  import type { ActionItem } from '../../Table';
  import type { PropType } from 'vue';

  const props = defineProps({
    popconfirm: Boolean,
    trigger: {
      type: String as PropType<'contextmenu' | 'click' | 'hover'>,
      default: () => {
        return ['contextmenu'];
      },
    },
    dropMenuList: {
      type: Array as PropType<(ActionItem & Recordable)[]>,
      default: () => [],
    },
    selectedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const dropdownRef = ref<any>(null);

  const onClose = (item) => {
    if (props.popconfirm && item.popConfirm) {
      return;
    }
    dropdownRef.value?.handleClose();
  };

  const getBindItemContentValues = (item: (typeof props.dropMenuList)[0]) => {
    return omit(item, ['onClick']);
  };

  const getBindValues = (item: (typeof props.dropMenuList)[0]) => {
    return omit(item, ['popConfirm', 'confirm', 'icon']);
  };
</script>
