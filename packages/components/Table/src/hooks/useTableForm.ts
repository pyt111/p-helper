import { computed, unref } from 'vue';
import { isFunction } from '@p-helper/utils/is';
import type { ComputedRef, Slots } from 'vue';
import type { BasicTableProps, FetchParams } from '../types/table';
import type { FormProps } from '@p-helper/components/Form';
// import { isFunction } from '@p-helper/utils/is';

export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,
  fetch: (opt?: FetchParams) => Promise<void>,
  getLoading: ComputedRef<boolean | undefined>
) {
  const getFormProps = computed((): Partial<FormProps> => {
    const { formConfig } = unref(propsRef);
    const { submitButtonOptions } = formConfig || {};
    return {
      baseColProps: {
        span: 4,
      },
      inline: true,
      showAdvancedButton: false,
      ...formConfig,
      submitButtonOptions: {
        ...submitButtonOptions,
        loading: submitButtonOptions?.loading ? unref(getLoading) : false,
      },
      compact: true,
    };
  });

  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots);
    return keys
      .map((item) => (item.startsWith('form-') ? item : null))
      .filter((item) => !!item) as string[];
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/form\-/, '') ?? '';
  }

  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef);
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      // @ts-ignore
      info = handleSearchInfoFn(info) || info;
    }
    fetch({ searchInfo: info, page: 1 });
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
    handleSearchInfoChange,
  };
}
