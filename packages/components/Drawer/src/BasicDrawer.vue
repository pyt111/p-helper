<template>
  <ElDrawer v-bind="getBindValues" :class="prefixCls" @close="onClose">
    <template v-if="!$slots.header" #header>
      <DrawerHeader
        :title="getMergeProps.title"
        :is-detail="isDetail"
        :show-detail-back="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar" />
        </template>
      </DrawerHeader>
    </template>
    <template v-else #header>
      <slot name="header" />
    </template>

    <ElScrollbar
      v-loading="getLoading"
      v-bind="getProps.scrollOptions"
      :style="getScrollContentStyle"
      :loading-tip="loadingText || '加载中...'"
    >
      <slot />
    </ElScrollbar>
    <DrawerFooter
      v-bind="getProps"
      :height="getFooterHeight"
      @close="onClose"
      @ok="handleOk"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </DrawerFooter>
  </ElDrawer>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    nextTick,
    ref,
    toRaw,
    unref,
    watch,
  } from 'vue';
  import { ElDrawer, ElScrollbar } from 'element-plus';
  import { isFunction, isNumber } from '@p-helper/utils/is';
  import { deepMerge } from '@p-helper/utils';
  import { useAttrs } from '@p-helper/hooks/core/useAttrs';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { omit } from 'lodash-es';
  import DrawerFooter from './components/DrawerFooter.vue';
  import DrawerHeader from './components/DrawerHeader.vue';
  import { basicDrawerEmits, basicDrawerProps } from './props';
  import type {
    DrawerInstance,
    DrawerProps,
    ElDrawerBasicProps,
  } from './typing';
  import type { CSSProperties } from 'vue';

  export const elDrawerProps = (ElDrawer as any).props;
  export default defineComponent({
    components: { ElDrawer, ElScrollbar, DrawerFooter, DrawerHeader },
    props: { ...basicDrawerProps, ...elDrawerProps },
    emits: basicDrawerEmits,
    setup(props, { emit }) {
      const openRef = ref(false);
      const attrs = useAttrs();
      const propsRef = ref<Partial<DrawerProps | null>>();

      const { prefixVar, prefixCls } = useDesign('basic-drawer');

      const drawerInstance: DrawerInstance = {
        setDrawerProps: setDrawerProps as any,
        emitOpen: undefined,
      };

      const instance = getCurrentInstance();

      instance && emit('register', drawerInstance, instance.uid);

      const getMergeProps = computed((): DrawerProps => {
        return deepMerge(toRaw(props), unref(propsRef)) as any;
      });

      const getProps = computed((): DrawerProps => {
        const opt = {
          ...unref(attrs),
          ...unref(getMergeProps),
          modelValue: unref(openRef),
        };
        // opt.title = undefined;
        const { isDetail, size, wrapClassName, modalClass, inContainer } = opt;
        if (isDetail) {
          if (!size) {
            opt.size = '100%';
          }
          const detailCls = `${prefixCls}__detail`;
          opt.class = wrapClassName
            ? `${wrapClassName} ${detailCls}`
            : detailCls;
        }

        if ((isDetail && !modalClass) || inContainer) {
          opt.modalClass = `${prefixCls}-in-container-modal`;
        }
        return opt as DrawerProps;
      });

      const getBindValues = computed((): ElDrawerBasicProps => {
        return omit(
          {
            ...unref(attrs),
            ...unref(getProps),
          },
          Object.keys(basicDrawerProps)
        ) as any;
      });

      // Custom implementation of the bottom button,
      const getFooterHeight = computed(() => {
        const { footerHeight, showFooter } = unref(getProps);
        if (showFooter && footerHeight) {
          return isNumber(footerHeight)
            ? `${footerHeight}px`
            : `${footerHeight.replace('px', '')}px`;
        }
        return `0px`;
      });

      const getScrollContentStyle = computed((): CSSProperties => {
        const footerHeight = unref(getFooterHeight);
        return {
          position: 'relative',
          height: `calc(100% - ${footerHeight})`,
        };
      });

      const getLoading = computed(() => {
        return !!unref(getProps)?.loading;
      });

      watch(
        () => getProps.value.modelValue,
        (newVal, oldVal) => {
          if (newVal !== oldVal) openRef.value = newVal;
        },
        { deep: true }
      );

      watch(
        () => openRef.value,
        (open) => {
          nextTick(() => {
            emit('open-change', open);
            instance && drawerInstance.emitOpen?.(open, instance.uid);
          });
        }
      );

      // Cancel event
      async function onClose() {
        const { closeFunc } = unref(getProps);
        emit('close');
        if (closeFunc && isFunction(closeFunc)) {
          const res = await closeFunc();
          openRef.value = !res;
          return;
        }
        openRef.value = false;
      }

      function setDrawerProps(props: Partial<DrawerProps>): void {
        // Keep the last setDrawerProps
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);

        if (Reflect.has(props, 'modelValue')) {
          openRef.value = !!props.modelValue;
        }
      }

      function handleOk() {
        emit('ok');
      }

      return {
        onClose,
        prefixCls,
        getMergeProps: getMergeProps as any,
        getScrollContentStyle,
        getProps: getProps as any,
        getLoading,
        getBindValues,
        getFooterHeight,
        handleOk,
      };
    },
  });
</script>
