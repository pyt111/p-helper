<script lang="tsx">
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
    setup(props, { emit, attrs, slots }) {
      const actionColOpt = computed(() => {
        if (!attrs.isCol) {
          return;
        }
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
      const { submitAction, resetAction } = useFormContext();

      const renderFormItem = () => {
        return (
          <el-form-item>
            {slots.submitBefore()}

            {props.showSubmitButton ? (
              <BasicButton
                type="primary"
                {...getSubmitBtnOptions.value}
                onClick={submitAction}
              >
                {getSubmitBtnOptions.value.label}
              </BasicButton>
            ) : null}
            {slots.resetBefore()}
            {props.showResetButton ? (
              <BasicButton
                type="primary"
                {...getResetBtnOptions.value}
                onClick={resetAction}
              >
                {getResetBtnOptions.value.label}
              </BasicButton>
            ) : null}
            {slots.advanceBefore()}
            {props.showAdvancedButton && !props.hideAdvanceBtn ? (
              <BasicButton size="small" link={true} onClick={toggleAdvanced}>
                {props.isAdvanced ? '收起' : '展开'}
              </BasicButton>
            ) : null}
            {slots.advanceAfter()}
          </el-form-item>
        );
      };

      return () => {
        if (attrs.isCol) {
          return props.showActionButtonGroup ? (
            <el-col {...actionColOpt.value} class="form-action">
              <div style="width: 100%">{renderFormItem()}</div>
            </el-col>
          ) : null;
        }
        return renderFormItem();
      };
    },
  });
</script>
