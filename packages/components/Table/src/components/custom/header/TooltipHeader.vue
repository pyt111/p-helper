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
        <el-icon :class="ns.e('icon')"><QuestionFilled /></el-icon>
      </slot>
    </span>
  </el-tooltip>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { QuestionFilled } from '@element-plus/icons-vue';
  import type { PropType } from 'vue';
  import type { ElTooltipProps } from 'element-plus';
  // TooltipHeader

  export default defineComponent({
    components: {
      QuestionFilled,
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

<style scoped></style>
