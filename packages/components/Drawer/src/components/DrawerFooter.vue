<template>
  <div v-if="showFooter || $slots.footer" :class="prefixCls" :style="getStyle">
    <template v-if="!$slots.footer">
      <slot name="insertFooter" />
      <ElButton
        v-if="showCancelBtn"
        v-bind="cancelButtonProps"
        class="mr-2"
        @click="handleClose"
      >
        {{ cancelText }}
      </ElButton>
      <slot name="centerFooter" />
      <ElButton
        v-if="showOkBtn"
        :type="okType"
        v-bind="okButtonProps"
        class="mr-2"
        :loading="confirmLoading"
        @click="handleOk"
      >
        {{ okText }}
      </ElButton>
      <slot name="appendFooter" />
    </template>

    <template v-else>
      <slot name="footer" />
    </template>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { ElButton } from 'element-plus';
  import { footerProps } from '../props';
  import type { CSSProperties } from 'vue';

  export default defineComponent({
    name: 'BasicDrawerFooter',
    props: {
      ...footerProps,
      height: {
        type: String,
        default: '60px',
      },
    },
    emits: ['ok', 'close'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-drawer-footer');

      const getStyle = computed((): CSSProperties => {
        const heightStr = `${props.height}`;
        return {
          height: heightStr,
          lineHeight: `calc(${heightStr} - 1px)`,
        };
      });

      function handleOk() {
        emit('ok');
      }

      function handleClose() {
        emit('close');
      }
      return { handleOk, prefixCls, handleClose, getStyle };
    },
  });
</script>
