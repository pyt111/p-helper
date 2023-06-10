// import type { NamePath } from 'ant-design-vue/lib/form/interface';
import { nextTick, onUnmounted, ref, unref, watch } from 'vue';
import { error } from '@p-helper/utils/log';
import { getDynamicProps } from '@p-helper/utils';
import type {
  FormActionType,
  FormProps,
  FormSchema,
  NamePath,
  UseFormReturnType,
} from '../types/form';

export declare type ValidateFields = (
  nameList?: NamePath[]
) => Promise<Recordable>;

type Props = Partial<DynamicProps<FormProps>>;

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      error('尚未获取表单实例，请确保在执行表单操作时已呈现表单!');
    }
    await nextTick();
    return form as FormActionType;
  }

  function register(instance: FormActionType) {
    onUnmounted(() => {
      formRef.value = null;
      loadedRef.value = null;
    });
    if (unref(loadedRef) && instance === unref(formRef)) return;

    formRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  const methods: FormActionType = {
    scrollToField: async (
      name: NamePath,
      options?: ScrollOptions | undefined
    ) => {
      const form = await getForm();
      form.scrollToField(name, options);
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      form.setProps(formProps);
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.updateSchema(data);
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.resetSchema(data);
    },

    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      form.clearValidate(name);
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },

    removeSchemaByFiled: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByFiled(field);
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    getFormModel: <T = Recordable>() => {
      return unref(formRef)?.getFormModel() as T;
    },

    setFieldsValue: async <T extends Recordable>(values: T) => {
      const form = await getForm();
      form.setFieldsValue(values);
    },

    appendSchemaByField: async (
      schema: FormSchema,
      prefixField: string | undefined,
      first?: boolean
    ) => {
      const form = await getForm();
      return form.appendSchemaByField(schema, prefixField, first);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    validate: async (fn): Promise<Recordable> => {
      const form = await getForm();
      return form.validate(fn);
    },

    validateFields: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validateFields(nameList);
    },
  };

  return [register, methods];
}
