<template>
  <el-dropdown ref="dropdownRef" :trigger="trigger" v-bind="$attrs">
    <span>
      <slot />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="item in dropMenuList" :key="`${item.text}`">
          <el-dropdown-item v-bind="getBindValues(item)" @click="onClose(item)">
            <el-popconfirm v-if="popconfirm && item.popConfirm" v-bind="item">
              <template #reference>
                <div class="trigger-item">
                  <Icon
                    v-if="item.popConfirm.icon"
                    :icon="item.popConfirm.icon"
                  />
                  <Icon v-if="item.icon" :icon="item.icon" />
                  <span>{{ item.text }}</span>
                </div>
              </template>
            </el-popconfirm>
            <template v-else>
              <Icon v-if="item.icon" :icon="item.icon" />
              <span>{{ item.text }}</span>
            </template>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '@p-helper/components/Icon';
  import { omit } from 'lodash-es';
  import type { PropType } from 'vue';
  import type { DropMenu } from './typing';

  const props = defineProps({
    popconfirm: Boolean,
    trigger: {
      type: String as PropType<'contextmenu' | 'click' | 'hover'>,
      default: () => {
        return ['contextmenu'];
      },
    },
    dropMenuList: {
      type: Array as PropType<(DropMenu & Recordable)[]>,
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

  const getBindValues = (item: (typeof props.dropMenuList)[0]) => {
    return omit(item, ['popConfirm', 'confirm']);
  };
</script>

<style scoped lang="scss">

</style>
