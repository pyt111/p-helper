import { nextTick, toRaw, unref } from 'vue';
import {
  isArray,
  isDef,
  isFunction,
  isObject,
  isString,
} from '@p-helper/utils/is';
import { deepMerge } from '@p-helper/utils';
import { dateUtil } from '@p-helper/utils/dateUtil';
import { cloneDeep, get, set, uniqBy } from 'lodash-es';
import { error } from '@p-helper/utils/log';
import {
  dateItemType,
  defaultValueComponents,
  handleInputNumberValue,
} from '../helper';
import type {
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
  NamePath,
} from '../types/form';
import type { ComputedRef, Ref } from 'vue';

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  defaultValueRef: Ref<Recordable>;
  formElRef: Ref<FormActionType>;
  schemaRef: Ref<FormSchema[]>;
  handleFormValues: (...args) => any;
}

function tryConstructArray(
  field: string,
  values: Recordable = {}
): any[] | undefined {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      if (!keys.length) {
        return undefined;
      }

      const result = [];
      keys.forEach((k, index) => {
        set(result, index, values[k.trim()]);
      });

      return result.filter(Boolean).length ? result : undefined;
    }
  }
}

function tryConstructObject(
  field: string,
  values: Recordable = {}
): Recordable | undefined {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      if (!keys.length) {
        return;
      }

      const result = {};
      keys.forEach((k) => {
        set(result, k.trim(), values[k.trim()]);
      });

      return Object.values(result).filter(Boolean).length ? result : undefined;
    }
  }
}
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}: UseFormActionContext) {
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      const isInput =
        schema?.component && defaultValueComponents.includes(schema.component);
      formModel[key] = isInput
        ? defaultValueRef.value[key] || ''
        : defaultValueRef.value[key];
    });
    nextTick(() => clearValidate());

    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean);

    // key 支持 a.b.c 的嵌套写法
    const delimiter = '.';
    const nestKeyArray = fields.filter(
      (item) => String(item).indexOf(delimiter) >= 0
    );

    const validKeys: string[] = [];
    fields.forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = get(values, key);
      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      const { componentProps } = schema || {};
      let _props = componentProps as any;
      if (typeof componentProps === 'function') {
        _props = _props({ formModel: unref(formModel) });
      }

      const constructValue =
        tryConstructArray(key, values) || tryConstructObject(key, values);

      // 0| '' is allow
      if (hasKey || !!constructValue) {
        const fieldValue = constructValue || value;
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(fieldValue)) {
            const arr: any[] = [];
            for (const ele of fieldValue) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            unref(formModel)[key] = arr;
          } else {
            unref(formModel)[key] = fieldValue
              ? _props?.valueFormat
                ? fieldValue
                : dateUtil(fieldValue)
              : null;
          }
        } else {
          unref(formModel)[key] = fieldValue;
        }
        if (_props?.onChange) {
          _props?.onChange(fieldValue);
        }
        validKeys.push(key);
      } else {
        nestKeyArray.forEach((nestKey: string) => {
          try {
            const value = nestKey
              .split('.')
              .reduce((out, item) => out[item], values);
            if (isDef(value)) {
              unref(formModel)[nestKey] = unref(value);
              validKeys.push(nestKey);
            }
          } catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              unref(formModel)[nestKey] = cloneDeep(
                unref(defaultValueRef.value[nestKey])
              );
            }
          }
        });
      }
    });
    validateFields(validKeys).catch((_) => {});
  }
  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByFiled(fields: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields;
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      _removeSchemaByFiled(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFiled(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const index = schemaList.findIndex((schema) => schema.field === field);
      if (index !== -1) {
        delete formModel[field];
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(
    schema: FormSchema,
    prefixField?: string,
    first = false
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));

    const index = schemaList.findIndex(
      (schema) => schema.field === prefixField
    );

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema);
      schemaRef.value = schemaList;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    schemaRef.value = schemaList;
  }

  async function resetSchema(
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        item.component === 'Divider' ||
        (Reflect.has(item, 'field') && item.field)
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field'
      );
      return;
    }
    schemaRef.value = updateData as FormSchema[];
  }

  async function updateSchema(
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        item.component === 'Divider' ||
        (Reflect.has(item, 'field') && item.field)
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field'
      );
      return;
    }
    const schema: FormSchema[] = [];
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item);
          schema.push(newSchema as FormSchema);
        } else {
          schema.push(val);
        }
      });
    });
    schemaRef.value = uniqBy(schema, 'field');
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(unref(formModel)) as Recordable);
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some((item) => {
      return item.field === key && item.component
        ? dateItemType.includes(item.component)
        : false;
    });
  }

  async function validateFields(nameList?: NamePath[] | undefined) {
    return unref(formElRef)?.validateFields(nameList);
  }

  async function validate(...args) {
    return unref(formElRef)?.validate(...args);
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef)?.clearValidate(name);
  }

  async function scrollToField(
    name: NamePath,
    options?: ScrollOptions | undefined
  ) {
    await unref(formElRef)?.scrollToField(name, options);
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      const isValidate = await validate();
      let values = isValidate;
      if (isValidate) {
        values = formModel;
      }
      const res = handleFormValues(values);
      emit('submit', res);
    } catch (error: any) {
      // throw new Error(Object.keys(error).join(','));
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}
