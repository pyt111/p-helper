<script lang="ts">
  import { computed, defineComponent, h, unref } from 'vue';
  import { ElPopconfirm } from 'element-plus';
  import { extendSlots } from '@p-helper/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';
  import BasicButton from './BasicButton.vue';
  import type { ActionItem } from '../../Table';

  const props = {
    /**
     * 是否启用弹框提示
     * @default: true
     */
    enablePopConfirm: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    props,
    setup(props, { slots, attrs }) {
      // get inherit binding value
      const getBindValues = computed(() => {
        return { ...props, ...unref(attrs) };
      });

      return () => {
        const bindValues = omit(
          unref(getBindValues),
          'enablePopConfirm'
        ) as ActionItem;
        const btnBind = omit(bindValues, [
          'title',
          'confirmButtonText',
          'cancelButtonText',
          'getPopupContainer',
        ]) as Recordable;
        if (btnBind.disabled) btnBind.colorClassName = '';
        const Button = h(BasicButton, btnBind, extendSlots(slots));

        if (!props.enablePopConfirm) {
          return Button;
        }
        return h(
          ElPopconfirm,
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            ...bindValues.popConfirm,
          },
          { reference: () => Button }
        );
      };
    },
  });
</script>
