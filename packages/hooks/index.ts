import { computed, getCurrentInstance, ref } from 'vue';
import type { AppConfig, ComponentCustomProperties } from 'vue';
export * from './use-namespace';
export * from './web/antv';

export const ensureGlobalProperties = (): AppConfig['globalProperties'] &
  ComponentCustomProperties => {
  const globalProperties =
    getCurrentInstance()!.appContext.config.globalProperties;
  if (!globalProperties) {
    throw new Error('请在setup或生命周期钩子调用');
  }
  return globalProperties as ComponentCustomProperties;
};

export function syncProp<T = any>(
  props: Record<string, any>,
  propName: string,
  updateEventName?: string | undefined
) {
  const thisVm = getCurrentInstance()! as any;

  let eventName;

  if (typeof updateEventName === 'string') {
    eventName = updateEventName;
  } else {
    eventName =
      propName === 'modelValue' ? 'update:modelValue' : `update:${propName}`;
  }

  // thisVm.$options.emits.push(eventName);
  if (!thisVm!.emitsOptions) {
    thisVm.emitsOptions = {};
  }
  thisVm.emitsOptions[eventName] = null;

  return computed<T>({
    get() {
      return props[propName];
    },
    set(val) {
      thisVm.emit(eventName, val);
    },
  });
}

/**
 * for循环中使用refs
 */
export function useRefsUpdate() {
  const itemRefs = ref({});
  const setItemRef = (key: string) => {
    return (el) => {
      if (el) {
        itemRefs.value[key] = el;
      }
    };
  };

  return {
    setItemRef,
    itemRefs,
  };
}
