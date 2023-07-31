<template>
  <svg
    aria-hidden="true"
    :class="['yee-svg-icon', $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, watchEffect } from 'vue';
  import { propTypes } from '@p-helper/utils/propTypes';
  import { isBoolean } from '@p-helper/utils/is';
  import { disabledColor } from '../constant';
  import type { CSSProperties } from 'vue';
  // import { useDesign } from '@p-helper/hooks/web/useDesign';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: [Number, String],
        default: 16,
      },
      color: {
        type: String,
      },
      spin: {
        type: Boolean,
        default: false,
      },
      // 禁用，将svg中的path的fill颜色改成disabledColor
      disabled: propTypes.bool.def(undefined),
    },
    setup(props) {
      const prefixCls = 'yee';
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);
      const symbolElement = ref<Element | null>();

      const getStyle = computed((): CSSProperties => {
        const { size } = props;
        let s = `${size}`;
        s = `${s.replace('px', '')}px`;
        return {
          width: s,
          height: s,
        };
      });
      const changeColor = (color) => {
        if (!symbolElement.value) {
          symbolElement.value = document.body.querySelector(symbolId.value);
        }

        if (symbolElement.value) {
          const paths = symbolElement.value.querySelectorAll('path');
          paths.forEach((pathElement) => {
            const originalFill =
              pathElement.attributes['data-original-fill']?.value;
            // 如果没有originalFill 说明path本身没有fill值  是不需要覆盖
            if (originalFill) {
              pathElement.setAttribute('fill', color ? color : originalFill);
            }
          });
        }
      };

      watchEffect(() => {
        changeColor(
          isBoolean(props.disabled) && props.disabled
            ? disabledColor
            : props.color
        );
      });
      return { symbolId, prefixCls, getStyle };
    },
  });
</script>
<style lang="scss" scoped>
  .svg-icon {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
    transition: color 0.2s ease;
  }

  .svg-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }
</style>
