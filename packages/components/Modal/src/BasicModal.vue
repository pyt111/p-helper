<template>
  <el-dialog v-bind="getBindDialogValue" v-model="visibleRef">
    <template v-if="!$slots.header" #header>
      <ModalHeader
        :help-message="getProps.helpMessage"
        :sub-title="getProps.subTitle"
        :title="getMergeProps.title"
      />
    </template>
    <template v-if="!noBottom && !$slots.footer" #footer>
      <ModalFooter v-bind="getBindValue" @cancel="handleCancel" @ok="handleOk">
        <template v-for="item in Object.keys($slots)" #[item]="data">
          <slot :name="item" v-bind="data || {}" />
        </template>
      </ModalFooter>
    </template>

    <el-scrollbar v-bind="getBindModalBodyProps">
      <slot />
    </el-scrollbar>
    <template
      v-for="item in Object.keys(omit($slots, 'default'))"
      #[item]="data"
    >
      <slot :name="item" v-bind="data || {}" />
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="BasicModal">
  import {
    computed,
    getCurrentInstance,
    ref,
    unref,
    useAttrs,
    watch,
    watchEffect,
  } from 'vue';
  import { omit, pick } from 'lodash-es';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { isFunction } from '@p-helper/utils/is';
  import { deepMerge } from '@p-helper/utils';
  import ModalHeader from './components/ModalHeader.vue';
  import ModalFooter from './components/ModalFooter.vue';
  import { basicProps, modalBodyPropsKeys, modalPropsKeys } from './props';
  import type { ModalMethods, ModalProps } from './typing';

  const props = defineProps(basicProps);
  const emit = defineEmits([
    'visible-change',
    'height-change',
    'cancel',
    'ok',
    'register',
    'update:modelValue',
  ]);
  const attrs = useAttrs();
  const { prefixCls } = useDesign('basic-modal');

  const visibleRef = ref(false);
  const propsRef = ref<Partial<ModalProps> | null>(null);

  const modalMethods: ModalMethods = {
    setModalProps,
    emitVisible: undefined,
    redoModalHeight: () => {},
  };

  const instance = getCurrentInstance();
  if (instance) {
    emit('register', modalMethods, instance.uid);
  }

  const getMergeProps = computed((): Recordable => {
    return {
      ...props,
      ...(unref(propsRef) as any),
    };
  });

  const getProps = computed((): Recordable => {
    const opt = {
      ...unref(getMergeProps),
      visible: unref(visibleRef),
      okButtonProps: undefined,
      cancelButtonProps: undefined,
      title: undefined,
    };
    return {
      ...opt,
      // wrapClassName: unref(getWrapClassName),
    };
  });

  const getBindValue = computed((): Recordable => {
    return {
      ...attrs,
      ...unref(getMergeProps),
      noresize: false, // 滚动区域 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
    };
  });

  const getBindDialogValue = computed(() => {
    return pick(unref(getBindValue), modalPropsKeys);
  });

  const getBindModalBodyProps = computed(() => {
    return pick(unref(getBindValue), modalBodyPropsKeys);
  });

  /**
   * @description: 设置modal参数
   */
  function setModalProps(props: Partial<ModalProps>): void {
    // Keep the last setModalProps
    propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
    if (Reflect.has(props, 'modelValue')) {
      visibleRef.value = !!props.modelValue;
    }
  }

  // 取消事件
  async function handleCancel(e: Event) {
    e?.stopPropagation();
    // 过滤自定义关闭按钮的空白区域
    if (
      (e.target as HTMLElement)?.classList?.contains(
        `${prefixCls}-close--custom`
      )
    )
      return;
    if (props.closeFunc && isFunction(props.closeFunc)) {
      const isClose: boolean = await props.closeFunc();
      visibleRef.value = !isClose;
      return;
    }

    visibleRef.value = false;
    emit('cancel', e);
  }

  function handleOk(e: Event) {
    emit('ok', e);
  }

  watchEffect(() => {
    visibleRef.value = !!props.modelValue;
  });

  watch(
    () => unref(visibleRef),
    (v) => {
      emit('visible-change', v);
      emit('update:modelValue', v);
      instance && modalMethods.emitVisible?.(v, instance.uid);
    },
    {
      immediate: false,
    }
  );
</script>
