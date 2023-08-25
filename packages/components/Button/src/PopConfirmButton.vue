<script lang="ts">
  import { computed, defineComponent, h, unref } from 'vue';
  import { ElPopconfirm } from 'element-plus';
  import { extendSlots } from '@p-helper/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';
  import { useAttrs } from '@p-helper/hooks/core/useAttrs';
  import BasicButton from './BasicButton.vue';

  const props = {
    /**
     * 是否启用下拉菜单
     * @default: true
     */
    enable: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const attrs = useAttrs();

      // get inherit binding value
      const getBindValues = computed(() => {
        return Object.assign(
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          },
          { ...props, ...unref(attrs) }
        );
      });

      return () => {
        const bindValues = omit(unref(getBindValues), 'enable');
        const btnBind = omit(bindValues, 'title') as Recordable;
        if (btnBind.disabled) btnBind.colorClassName = '';
        const Button = h(BasicButton, btnBind, extendSlots(slots));

        if (!props.enable) {
          return Button;
        }
        // console.log('getBindValues >--->', bindValues);
        return h(ElPopconfirm, bindValues, { reference: () => Button });
      };
    },
  });
</script>
