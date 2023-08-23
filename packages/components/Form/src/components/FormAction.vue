<template>
  <el-col
    v-if="showActionButtonGroup"
    v-bind="actionColOpt"
    class="form-action"
  >
    <div style="width: 100%">
      <el-form-item>
        <slot name="submitBefore" />

        <BasicButton
          v-if="showSubmitButton"
          class="ml-8px"
          type="primary"
          v-bind="getSubmitBtnOptions"
          @click="submitAction"
        >
          {{ getSubmitBtnOptions.label }}
        </BasicButton>

        <slot name="resetBefore" />
        <BasicButton
          v-if="showResetButton"
          class="ml-8px"
          type="primary"
          v-bind="getResetBtnOptions"
          @click="resetAction"
        >
          {{ getResetBtnOptions.label }}
        </BasicButton>
        <slot name="advanceBefore" />
        <BasicButton
          v-if="showAdvancedButton && !hideAdvanceBtn"
          size="small"
          link
          @click="toggleAdvanced"
        >
          {{ isAdvanced ? '收起' : '展开' }}
          <!--          <BasicArrow class="ml-1" :expand="!isAdvanced" up />-->
        </BasicButton>
        <slot name="advanceAfter" />
      </el-form-item>
    </div>
  </el-col>
</template>
<script lang="ts">
  //import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
  import { computed, defineComponent } from 'vue';
  import { BasicButton } from '@p-helper/components/Button';
  // import { BasicArrow } from '@p-helper/components/Basic';
  import { propTypes } from '@p-helper/utils/propTypes';
  import { useFormContext } from '../hooks/useFormContext';
  import type { ButtonProps } from '@p-helper/components/Button';
  import type { PropType } from 'vue';
  import type { ColEx } from '../types';

  type ButtonOptions = Partial<ButtonProps> & { label: string; link?: boolean };

  export default defineComponent({
    name: 'BasicFormAction',
    components: {
      BasicButton,
      // BasicArrow,
    },
    inheritAttrs: false,
    props: {
      showActionButtonGroup: propTypes.bool.def(true),
      showResetButton: propTypes.bool.def(true),
      showSubmitButton: propTypes.bool.def(true),
      showAdvancedButton: propTypes.bool.def(true),
      resetButtonOptions: {
        type: Object as PropType<ButtonOptions>,
        default: () => ({}),
      },
      submitButtonOptions: {
        type: Object as PropType<ButtonOptions>,
        default: () => ({}),
      },
      actionColOptions: {
        type: Object as PropType<Partial<ColEx>>,
        default: () => ({}),
      },
      actionSpan: propTypes.number.def(6),
      isAdvanced: propTypes.bool,
      hideAdvanceBtn: propTypes.bool,
    },
    emits: ['toggle-advanced'],
    setup(props, { emit }) {
      const actionColOpt = computed(() => {
        const {
          showAdvancedButton,
          actionSpan: span,
          actionColOptions,
        } = props;
        const actionSpan = 24 - span;
        const advancedSpanObj = showAdvancedButton
          ? { span: actionSpan < 6 ? 24 : actionSpan }
          : {};
        const actionColOpt: Partial<ColEx> = {
          style: { justifyContent: 'flex-start' },
          span: showAdvancedButton ? 6 : 4,
          ...advancedSpanObj,
          ...actionColOptions,
        };

        return actionColOpt;
      });

      const getResetBtnOptions = computed((): ButtonOptions => {
        return Object.assign(
          {
            label: '重置',
          },
          props.resetButtonOptions
        );
      });

      const getSubmitBtnOptions = computed(() => {
        return Object.assign(
          {
            label: '搜索',
          },
          props.submitButtonOptions
        );
      });

      function toggleAdvanced() {
        emit('toggle-advanced');
      }

      return {
        actionColOpt,
        getResetBtnOptions,
        getSubmitBtnOptions,
        toggleAdvanced,
        ...useFormContext(),
      };
    },
  });
</script>

<style lang="scss" scoped>
  .form-action:deep(.el-form-item) {
    .el-form-item__content {
      justify-content: v-bind('actionColOpt.style.justifyContent');
      flex-wrap: nowrap;
    }
  }
</style>
