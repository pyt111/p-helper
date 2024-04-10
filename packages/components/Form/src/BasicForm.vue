<template>
  <ElCard ref="formWrapperRef" class="form-card" shadow="never">
    <div class="form-content-wrapper">
      <div v-if="$slots.formLeft" class="form-left">
        <slot name="formLeft" />
      </div>
      <el-form
        v-bind="getFormProps"
        ref="formElRef"
        :class="getFormClass"
        :model="formModel"
        @keypress.enter="handleEnterPress"
      >
        <el-row v-bind="getRow">
          <slot name="formHeader" />
          <template v-for="(schema, i) in getSchema" :key="schema.field">
            <FormItem
              :all-default-values="defaultValueRef"
              :form-action-type="formActionType"
              :form-model="formModel"
              :form-props="getProps"
              :schema="schema"
              :set-form-model="setFormModel"
              :table-action="tableAction"
            >
              <template v-for="item in Object.keys($slots)" #[item]="data">
                <slot :name="item" v-bind="data || {}" />
              </template>
            </FormItem>
            <slot :index="i" name="formItemFooter" v-bind="schema" />
          </template>

          <FormAction
            v-bind="getFormActionBindProps"
            @toggle-advanced="handleToggleAdvanced"
          >
            <template
              v-for="item in [
                'resetBefore',
                'submitBefore',
                'advanceBefore',
                'advanceAfter',
              ]"
              #[item]="data"
            >
              <slot :name="item" v-bind="data || {}" />
            </template>
          </FormAction>
          <slot name="formFooter" />
        </el-row>
        <slot name="formRight" />
      </el-form>
    </div>

    <div v-if="$slots.formBottom" class="form-bottom">
      <slot name="formBottom" />
    </div>
  </ElCard>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    ref,
    unref,
    watch,
  } from 'vue';
  import { dateUtil } from '@p-helper/utils/dateUtil';
  import { deepMerge } from '@p-helper/utils';
  import { useDebounceFn, useElementSize } from '@vueuse/core';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { omit } from 'lodash-es';
  import FormItem from './components/FormItem.vue';
  import FormAction from './components/FormAction.vue';

  import { dateItemType } from './helper';

  // import { cloneDeep } from 'lodash-es';

  import { useFormValues } from './hooks/useFormValues';
  import useAdvanced from './hooks/useAdvanced';
  import { useFormEvents } from './hooks/useFormEvents';
  import { createFormContext } from './hooks/useFormContext';
  import { useAutoFocus } from './hooks/useAutoFocus';
  // import { useModalContext } from '@p-helper/components/Modal';
  import { basicFormEmits, basicProps, excludeFormPropsKeys } from './props';
  import type { Ref } from 'vue';
  import type { AdvanceState } from './types/hooks';
  import type {
    FormActionType,
    FormProps,
    FormSchemaInner as FormSchema,
  } from './types/form';

  export default defineComponent({
    name: 'BasicForm',
    components: { FormItem, FormAction },
    props: basicProps,
    emits: basicFormEmits,
    setup(props, { emit, attrs }) {
      const formModel = reactive<any>({});
      // const modalFn = useModalContext();

      const advanceState = reactive<AdvanceState>({
        isAdvanced: true,
        hideAdvanceBtn: false,
        isLoad: false,
        actionSpan: 6,
      });

      const defaultValueRef = ref<Recordable>({});
      const isInitedDefaultRef = ref(false);
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);
      const formWrapperRef = ref(null);
      const { width, height } = useElementSize(formWrapperRef);

      const { prefixCls } = useDesign('basic-form');

      // Get the basic configuration of the form
      const getProps = computed((): FormProps => {
        // @ts-nocheck
        return { ...props, ...unref(propsRef) } as FormProps;
      });

      const getFormClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--compact`]: unref(getProps).compact,
            'is-col-layout': getProps.value.isCol,
          },
        ];
      });

      // Get uniform row style and Row configuration for the entire form
      const getRow = computed(() => {
        const { baseRowStyle = {}, rowProps } = unref(getProps);
        return {
          style: baseRowStyle,
          ...rowProps,
        };
      });

      const getBindValue = computed(() => ({
        ...attrs,
        ...props,
        ...unref(getProps),
      }));

      const getFormProps = computed(() =>
        omit(getBindValue.value, excludeFormPropsKeys)
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] =
          unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue, component } = schema;
          // handle date type
          if (defaultValue && dateItemType.includes(component)) {
            if (!Array.isArray(defaultValue)) {
              schema.defaultValue = dateUtil(defaultValue);
            } else {
              const def: any[] = [];
              defaultValue.forEach((item) => {
                def.push(dateUtil(item));
              });
              schema.defaultValue = def;
            }
          }
        }
        if (unref(getProps).showAdvancedButton) {
          return schemas.filter(
            (schema) => schema.component !== 'Divider'
          ) as FormSchema[];
        } else {
          return schemas as FormSchema[];
        }
      });

      const { handleToggleAdvanced } = useAdvanced({
        advanceState,
        emit,
        getProps,
        getSchema,
        formModel,
        defaultValueRef,
      });

      const { handleFormValues, initDefault } = useFormValues({
        getProps,
        defaultValueRef,
        getSchema,
        formModel,
      });

      useAutoFocus({
        getSchema,
        getProps,
        isInitedDefault: isInitedDefaultRef,
        formElRef: formElRef as Ref<FormActionType>,
      });

      const {
        handleSubmit,
        setFieldsValue,
        clearValidate,
        validate,
        validateField,
        getFieldsValue,
        updateSchema,
        resetSchema,
        appendSchemaByField,
        removeSchemaByFiled,
        resetFields,
        scrollToField,
      } = useFormEvents({
        emit,
        getProps,
        formModel,
        getSchema,
        defaultValueRef,
        formElRef: formElRef as Ref<FormActionType>,
        schemaRef: schemaRef as Ref<FormSchema[]>,
        handleFormValues,
      });

      createFormContext({
        resetAction: resetFields,
        submitAction: handleSubmit,
      });

      watch(
        () => unref(getProps).model,
        () => {
          const { model } = unref(getProps);
          if (!model) return;
          setFieldsValue(model);
        },
        {
          immediate: true,
        }
      );

      watch(
        () => unref(getProps).schemas,
        (schemas) => {
          resetSchema(schemas ?? []);
        }
      );

      watch(
        () => getSchema.value,
        (schema) => {
          nextTick(() => {
            //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
            // modalFn?.redoModalHeight?.();
          });
          if (unref(isInitedDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isInitedDefaultRef.value = true;
          }
        }
      );

      watch(
        () => formModel,
        useDebounceFn(() => {
          unref(getProps).submitOnChange && handleSubmit();
        }, 300),
        { deep: true }
      );

      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }

      function setFormModel(key: string, value: any, schema: FormSchema) {
        formModel[key] = value;
        emit('field-value-change', key, value);
        if (schema && schema.itemProps && !schema.itemProps.autoLink) {
          validateField([key]).catch((_) => {});
        }
      }

      function handleEnterPress(e: KeyboardEvent) {
        const { autoSubmitOnEnter } = unref(getProps);
        if (!autoSubmitOnEnter) return;
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (
            target &&
            target.tagName &&
            target.tagName.toUpperCase() == 'INPUT'
          ) {
            handleSubmit();
          }
        }
      }

      function getFormModel() {
        return formModel;
      }

      const getClientRect = () => {
        return {
          width,
          height,
        };
      };

      const formActionType: Partial<FormActionType> = {
        getFieldsValue,
        getFormModel,
        setFieldsValue,
        resetFields,
        updateSchema,
        resetSchema,
        setProps,
        removeSchemaByFiled,
        appendSchemaByField,
        clearValidate,
        validateField,
        validate,
        submit: handleSubmit,
        scrollToField,
      };

      onMounted(() => {
        initDefault();
        emit('register', formActionType);
      });

      return {
        getBindValue,
        getFormProps,
        handleToggleAdvanced,
        handleEnterPress,
        formModel,
        defaultValueRef,
        advanceState,
        getRow,
        getProps,
        formElRef,
        getSchema,
        formActionType: formActionType as any,
        setFormModel,
        getFormClass,
        getFormActionBindProps: computed(() => ({
          ...getProps.value,
          ...advanceState,
        })),
        ...formActionType,
        formWrapperRef,
        width,
        height,
        getClientRect,
      };
    },
  });
</script>
