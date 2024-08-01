import {
  computed,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRaw,
  unref,
  watchEffect,
} from 'vue';
import { isProdMode } from '@p-helper/utils/env';
import { isFunction } from '@p-helper/utils/is';
import { tryOnUnmounted } from '@vueuse/core';
import { isEqual } from 'lodash-es';
import { error } from '@p-helper/utils/log';
import type {
  DrawerInstance,
  DrawerProps,
  ReturnDrawerMethods,
  UseDrawerInnerReturnType,
  UseDrawerReturnType,
} from './typing';

const dataTransferRef = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

/**
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('useDrawer() 只能在setup() 或功能组件内部使用！');
  }
  const drawer = ref<DrawerInstance | null>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<number>(0);

  function register(drawerInstance: DrawerInstance, uuid: number) {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawer.value = null;
        loaded.value = null;
        dataTransferRef[unref(uid)] = null;
      });

    if (unref(loaded) && isProdMode() && drawerInstance === unref(drawer)) {
      return;
    }
    uid.value = uuid;
    drawer.value = drawerInstance;
    loaded.value = true;

    drawerInstance.emitOpen = (open: boolean, uid: number) => {
      openData[uid] = open;
    };
  }

  const getInstance = () => {
    const instance = unref(drawer);
    if (!instance) {
      error('useDrawer实例未定义！');
    }
    return instance;
  };

  const methods: ReturnDrawerMethods = {
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      getInstance()?.setDrawerProps(props);
    },

    getOpen: computed((): boolean => {
      return openData[~~unref(uid)];
    }),

    openDrawer: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setDrawerProps({
        modelValue: open,
      });
      if (!data) return;

      if (openOnSet) {
        dataTransferRef[unref(uid)] = null;
        dataTransferRef[unref(uid)] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
      if (!equal) {
        dataTransferRef[unref(uid)] = toRaw(data);
      }
    },
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ modelValue: false });
    },
  };

  return [register, methods];
}

export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number>(0);

  if (!getCurrentInstance()) {
    throw new Error('useDrawerInner() 只能在setup() 或功能组件内部使用！');
  }

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      error('useDrawerInner实例未定义！');
      return;
    }
    return instance;
  };

  const register = (modalInstance: DrawerInstance, uuid: number) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null;
      });

    uidRef.value = uuid;
    drawerInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ confirmLoading: loading });
      },
      getOpen: computed((): boolean => {
        return openData[~~unref(uidRef)];
      }),

      closeDrawer: () => {
        getInstance()?.setDrawerProps({ modelValue: false });
      },

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance()?.setDrawerProps(props);
      },
    },
  ];
};
