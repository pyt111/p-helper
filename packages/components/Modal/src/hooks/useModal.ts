import {
  computed,
  getCurrentInstance,
  nextTick,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  unref,
  watchEffect,
} from 'vue';
import { isFunction } from '@p-helper/utils/is';
import { isEqual } from 'lodash-es';
import { tryOnUnmounted } from '@vueuse/core';
import { error } from '@p-helper/utils/log';
import { isProdMode } from '@p-helper/utils/env';
import type { AnyFn } from '@vueuse/shared/index';

import type {
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
  UseModalReturnType,
} from '../typing';

const dataTransfer = reactive<any>({});

const visibleData = reactive<{ [key: number]: boolean }>({});

/**
 * @description: 外部调用
 */
export function useModal(opt?: {
  confirmCallback?: AnyFn;
}): UseModalReturnType {
  const modal = ref<Nullable<ModalMethods>>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<string | number>('');

  function register(modalMethod: ModalMethods, uuid: number | string) {
    if (!getCurrentInstance()) {
      throw new Error(
        'useModal() can only be used inside setup() or functional components!'
      );
    }
    uid.value = uuid || '';
    isProdMode() &&
      onUnmounted(() => {
        modal.value = null;
        loaded.value = false;
        dataTransfer[unref(uid)] = null;
      });
    if (unref(loaded) && isProdMode() && modalMethod === unref(modal)) return;

    modal.value = modalMethod;
    loaded.value = true;
    modalMethod.emitVisible = (visible: boolean, uid: number) => {
      visibleData[uid] = visible;
    };
    modalMethod.confirmCallback = opt?.confirmCallback;
  }

  const getInstance = () => {
    const instance = unref(modal);
    if (!instance) {
      error('useModal instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },

    getVisible: computed((): boolean => {
      return visibleData[~~unref(uid)];
    }),

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.();
    },

    openModal: async <T = any>(
      visible = true,
      data?: T,
      openOnSet = true
    ): Promise<void> => {
      getInstance()?.setModalProps({
        modelValue: visible,
      });

      if (!data) return;
      const id = unref(uid);
      if (openOnSet) {
        dataTransfer[id] = null;
        dataTransfer[id] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data));
      if (!equal) {
        dataTransfer[id] = toRaw(data);
      }
      await nextTick();
    },

    closeModal: () => {
      getInstance()?.setModalProps({ modelValue: false });
    },
  };
  // @ts-ignore
  return [register, methods];
}

/**
 * @description 当使用一个单文件去写弹窗组件时使用这个，外部调用自己写的组件需要用useModal去在外部注册，然后可以与这个单文件组件交互
 */
export const useModalInner = (callbackFn?: AnyFn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number | string>('');

  const getInstance = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      error('useModalInner instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: ModalMethods, uuid: number) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });
    uidRef.value = uuid;
    modalInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    // @ts-ignore
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading });
      },

      getVisible: computed((): boolean => {
        return visibleData[~~unref(uidRef)];
      }),

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance()?.setModalProps({ modelValue: false });
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props);
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight;
        callRedo && callRedo();
      },
      confirmCallback: (...args) => {
        getInstance()?.confirmCallback?.(...args);
      },
    },
  ];
};
