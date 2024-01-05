<template>
  <el-tooltip
    :class="ns.b()"
    :content="content"
    raw-content
    placement="top"
    v-bind="tooltipProps"
  >
    <span :class="ns.e('wrapper')">
      {{ label }}
      <slot name="icon">
        <ElIcon :class="ns.e('icon')"><QuestionFilled /></ElIcon>
      </slot>
    </span>
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
  </el-tooltip>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { ElIcon, ElTooltip } from 'element-plus';
  import { QuestionFilled } from '@element-plus/icons-vue';
  import type { PropType } from 'vue';
  import type { ElTooltipProps } from 'element-plus';
  // TooltipHeader

  export default defineComponent({
    name: 'TableTooltipHeader',
    components: {
      ElTooltip,
      QuestionFilled,
      ElIcon,
    },
    props: {
      label: {
        type: String,
      },
      content: {
        type: String,
      },
      tooltipProps: {
        type: Object as PropType<Partial<ElTooltipProps>>,
      },
    },
    setup() {
      const ns = useNamespace('table-header-tooltip');

      return {
        ns,
      };
    },
  });
</script>
