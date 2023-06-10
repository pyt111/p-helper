<template>
  <el-radio-group v-bind="getBindValues">
    <template v-for="item in props.options" :key="item.label">
      <el-radio v-bind="getLabelBindValues(item)">
        <VNodeRenderer v-if="item.slot" :node="item.slot" />
        <template v-else>
          {{ item.content || item.label }}
        </template>
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script lang="ts" setup name="FormRadioGroup">
  import { computed, useAttrs } from 'vue';
  import VNodeRenderer from '@p-helper/components/VNodeRenderer';
  import { omit } from 'lodash-es';
  import type { RadioProps } from 'element-plus';

  const attrs = useAttrs();

  interface BasicRadioProps extends RadioProps {
    content: string;
    slot: (() => VueNode | VueNode[]) | VueNode | VueNode[];
  }

  const props = defineProps({
    options: {
      type: Array as PropType<BasicRadioProps[]>,
      default: () => [] as BasicRadioProps[],
    },
  });

  const getBindValues = computed(() => {
    return attrs;
  });

  const getLabelBindValues = (option: BasicRadioProps) => {
    return omit(option, ['slot', 'content']);
  };
</script>
