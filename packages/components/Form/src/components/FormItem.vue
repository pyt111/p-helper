<script lang="tsx">
  import { computed, defineComponent, unref } from 'vue';
  import { isBoolean, isFunction, isNull } from '@p-helper/utils/is';
  import { getSlot } from '@p-helper/utils/helper/tsxHelper';
  import { cloneDeep, upperFirst } from 'lodash-es';
  import { componentMap } from '../componentMap';
  import { createPlaceholderMessage, setComponentRuleType } from '../helper';
  import {
    type FormActionType,
    type FormProps,
    type FormSchemaInner as FormSchema,
    isComponentFormSchema,
  } from '../types/form';
  import type { PropType } from 'vue';
  // import type { ValidateOption } from 'element-plus/es/components/form/src/form.vue';
  import type { TableActionType } from '@p-helper/components/Table';
  // import { useItemLabelWidth } from '../hooks/useLabelWidth';

  interface ValidationRule {
    [key: string]: any;
  }

  export default defineComponent({
    name: 'BasicFormItem',
    inheritAttrs: false,
    props: {
      schema: {
        type: Object as PropType<FormSchema>,
        default: () => ({}),
      },
      formProps: {
        type: Object as PropType<FormProps>,
        default: () => ({}),
      },
      allDefaultValues: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      formModel: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      setFormModel: {
        type: Function as PropType<
          (key: string, value: any, schema: FormSchema) => void
        >,
        default: null,
      },
      tableAction: {
        type: Object as PropType<TableActionType>,
      },
      formActionType: {
        type: Object as PropType<FormActionType>,
      },
    },
    setup(props, { slots }) {
      // const { schema, formProps } = toRefs(props) as {
      //   schema: Ref<FormSchema>;
      //   formProps: Ref<FormProps>;
      // };

      // const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

      const getValues = computed(() => {
        const { allDefaultValues, formModel, schema } = props;
        const { mergeDynamicData } = props.formProps;
        return {
          field: schema.field,
          model: formModel,
          values: {
            ...mergeDynamicData,
            ...allDefaultValues,
            ...formModel,
          } as Recordable,
          schema,
        };
      });

      const getComponentsProps = computed(() => {
        const { schema, tableAction, formModel, formActionType } = props;
        let { componentProps = {} } = schema;
        if (isFunction(componentProps)) {
          componentProps =
            componentProps({
              schema,
              tableAction,
              formModel,
              formActionType,
            }) ?? {};
        }
        if (schema.component === 'Divider') {
          componentProps = Object.assign(
            { type: 'horizontal' },
            componentProps,
            {
              orientation: 'left',
              plain: true,
            }
          );
        }
        return componentProps as Recordable;
      });

      const getDisable = computed(() => {
        const { disabled: globDisabled } = props.formProps;
        const { dynamicDisabled } = props.schema;
        const { disabled: itemDisabled = false } = unref(getComponentsProps);
        let disabled = !!globDisabled || itemDisabled;
        if (isBoolean(dynamicDisabled)) {
          disabled = dynamicDisabled;
        }
        if (isFunction(dynamicDisabled)) {
          disabled = dynamicDisabled(unref(getValues));
        }
        return disabled;
      });

      function getShow(): { isShow: boolean; isIfShow: boolean } {
        const { show, ifShow } = props.schema;
        const { showAdvancedButton } = props.formProps;
        const itemIsAdvanced = showAdvancedButton
          ? isBoolean(props.schema.isAdvanced)
            ? props.schema.isAdvanced
            : true
          : true;

        let isShow = true;
        let isIfShow = true;

        if (isBoolean(show)) {
          isShow = show;
        }
        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(show)) {
          isShow = show(unref(getValues));
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(unref(getValues));
        }
        isShow = isShow && itemIsAdvanced;
        return { isShow, isIfShow };
      }

      function handleRules(): ValidationRule[] {
        const { rules: formRules } = props.formProps;
        const {
          rules: defRules = [],
          component,
          rulesMessageJoinLabel,
          label,
          dynamicRules,
          required,
          itemProps,
          field,
        } = props.schema;

        if (isFunction(dynamicRules)) {
          return dynamicRules(unref(getValues)) as ValidationRule[];
        }

        let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[];
        const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } =
          props.formProps;

        const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
          ? rulesMessageJoinLabel
          : globalRulesMessageJoinLabel;
        const defaultMsg = `${createPlaceholderMessage(component!)}${
          joinLabel ? label : ''
        }`;

        function validator(rule: any, value: any) {
          const msg = rule.message || defaultMsg;
          if (value === undefined || isNull(value)) {
            // 空值
            return Promise.reject(msg);
          } else if (Array.isArray(value) && value.length === 0) {
            // 数组类型
            return Promise.reject(msg);
          } else if (typeof value === 'string' && value.trim() === '') {
            // 空字符串
            return Promise.reject(msg);
          } else if (
            typeof value === 'object' &&
            Reflect.has(value, 'checked') &&
            Reflect.has(value, 'halfChecked') &&
            Array.isArray(value.checked) &&
            Array.isArray(value.halfChecked) &&
            value.checked.length === 0 &&
            value.halfChecked.length === 0
          ) {
            // 非关联选择的tree组件
            return Promise.reject(msg);
          }
          return Promise.resolve();
        }

        const getRequired = isFunction(required)
          ? required(unref(getValues))
          : required;

        if ((!rules || rules.length === 0) && getRequired) {
          rules = [{ required: getRequired, validator }];
        }

        const requiredRuleIndex: number = rules.findIndex(
          (rule) =>
            Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
        );

        if (requiredRuleIndex !== -1) {
          const rule = rules[requiredRuleIndex];
          const { isShow } = getShow();
          if (!isShow) {
            rule.required = false;
          }
          if (component) {
            if (!Reflect.has(rule, 'type')) {
              rule.type = component === 'InputNumber' ? 'number' : 'string';
            }

            rule.message = rule.message || defaultMsg;

            if (component.includes('Input') || component.includes('Textarea')) {
              rule.whitespace = true;
            }
            const valueFormat = unref(getComponentsProps)?.valueFormat;
            setComponentRuleType(rule, component, valueFormat);
          }
        }

        // Maximum input length rule check
        // const characterInx = rules.findIndex((val) => val.max);
        // if (characterInx !== -1 && !rules[characterInx].validator) {
        //   rules[characterInx].message = rules[characterInx].message;
        // }
        const rootRules = formRules?.[field] || [];
        // @ts-ignore
        return [...rootRules, ...(itemProps?.rules || []), ...rules];
      }

      function renderComponent() {
        if (!isComponentFormSchema(props.schema)) {
          return null;
        }
        const {
          renderComponentContent,
          component,
          field,
          valueField,
          componentProps,
        } = props.schema;

        let { changeEvent = 'update' } = props.schema;

        if (component === 'Input') {
          changeEvent = 'input';
        }

        const isCheck = component && ['Checkbox'].includes(component);
        let eventKey = `on${upperFirst(changeEvent)}`;

        const valueKey = valueField || 'modelValue';
        if (changeEvent === 'update' && valueKey === 'modelValue') {
          eventKey = `${eventKey}:${valueKey}`;
        }
        const on = {
          [eventKey]: (...args: Nullable<Recordable>[]) => {
            const [e] = args;
            if (propsData[eventKey]) {
              propsData[eventKey](...args);
            }
            const target = e ? e.target : null;
            const value = target
              ? isCheck
                ? target.checked
                : target.value
              : e;
            props.setFormModel(field, value, props.schema);
          },
        };
        const Comp = componentMap.get(component) as ReturnType<
          typeof defineComponent
        >;

        const { autoSetPlaceHolder, size, componentStyle } = props.formProps;
        const propsData: Recordable = {
          allowClear: true,
          getPopupContainer: (trigger: Element) => trigger.parentNode,
          size,
          style: {
            // width: '100%',
            ...componentStyle,
            ...componentProps?.style,
          },
          ...unref(getComponentsProps),
          disabled: unref(getDisable),
        };

        const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
        // RangePicker place is an array
        if (isCreatePlaceholder && component !== 'RangePicker' && component) {
          propsData.placeholder =
            unref(getComponentsProps)?.placeholder ||
            createPlaceholderMessage(component);
        }
        propsData.codeField = field;
        propsData.formValues = unref(getValues);

        const bindValue: Recordable<any> = {
          [valueField || valueKey || 'value']: props.formModel[field],
        };

        const compAttr: Recordable = {
          ...propsData,
          ...on,
          ...bindValue,
        };

        if (!renderComponentContent) {
          return <Comp {...compAttr} />;
        }
        const compSlot = isFunction(renderComponentContent)
          ? { ...renderComponentContent(unref(getValues)) }
          : {
              default: () => renderComponentContent,
            };
        // console.log('compSlot >--->', compSlot);
        return <Comp {...compAttr}>{compSlot}</Comp>;
      }

      function renderLabelHelpMessage() {
        const { label, helpMessage, subLabel } = {
          ...props.formProps.defaultSchema,
          ...props.schema,
        };
        const renderLabel = subLabel ? (
          <span>
            {label} <span class="text-secondary">{subLabel}</span>
          </span>
        ) : (
          label
        );
        const getHelpMessage = isFunction(helpMessage)
          ? helpMessage(unref(getValues))
          : helpMessage;
        if (
          !getHelpMessage ||
          (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
        ) {
          return renderLabel;
        }
        return <span>{renderLabel}</span>;
      }

      function renderItem() {
        const { itemProps, slot, render, field, suffix, component } =
          props.schema;
        // const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
        // const { colon } = props.formProps;
        const opts = { disabled: unref(getDisable) };

        if (component === 'Divider') {
          return (
            <el-divider {...unref(getComponentsProps)}>
              {renderLabelHelpMessage()}
            </el-divider>
          );
        } else {
          const getContent = () => {
            return slot
              ? getSlot(slots, slot, unref(getValues), opts)
              : render
              ? render(unref(getValues), opts)
              : renderComponent();
          };

          const showSuffix = !!suffix;
          const getSuffix = isFunction(suffix)
            ? suffix(unref(getValues))
            : suffix;

          return (
            <el-form-item
              prop={field}
              class={{ 'suffix-item': showSuffix }}
              {...(itemProps as Recordable)}
              rules={handleRules()}
            >
              {{
                label: () => renderLabelHelpMessage(),
                default: () => [
                  getContent(),
                  showSuffix && <span class="suffix">{getSuffix}</span>,
                ],
              }}
            </el-form-item>
          );
        }
      }

      return () => {
        const {
          colProps = {},
          colSlot,
          renderColContent,
          component,
          slot,
        } = props.schema;
        if (!((component && componentMap.has(component)) || slot)) {
          return null;
        }

        const {
          baseColProps = {},
          isCol = true,
          componentStyle,
        } = props.formProps;
        const realColProps = { ...baseColProps, ...colProps };
        const { isIfShow, isShow } = getShow();
        const values = unref(getValues);
        const opts = { disabled: unref(getDisable) };

        const getContent = () => {
          return colSlot
            ? getSlot(slots, colSlot, values, opts)
            : renderColContent
            ? renderColContent(values, opts)
            : renderItem();
        };

        // 不使用col布局的情况下，element-plus的bug，没有设置宽度会因为图表或者其他元素加入抖动
        if (!isCol) {
          if (!props.formProps.componentStyle?.width) {
            // 组件默认宽度
            props!.formProps.componentStyle = {
              width: '176px',
              ...componentStyle,
            };
          }
        }
        return (
          isIfShow &&
          (isCol ? (
            <el-col {...realColProps} v-show={isShow}>
              {getContent()}
            </el-col>
          ) : (
            getContent()
          ))
        );
      };
    },
  });
</script>
