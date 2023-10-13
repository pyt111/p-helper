<template>
  <SvgIcon
    v-if="isSvgIcon"
    :class="[$attrs.class, 'anticon']"
    :name="getSvgIcon"
    :size="size"
    :spin="spin"
    :disabled="disabled"
    :color="color"
  />
  <span
    v-else
    ref="elRef"
    :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']"
    :style="getWrapStyle"
  >
    <slot />
  </span>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    ref,
    unref,
    watch,
  } from 'vue';
  // import Iconify from '@purge-icons/generated';
  import { isString } from '@p-helper/utils/is';
  import SvgIcon from './SvgIcon.vue';
  import { iconProps } from './props';
  import type { CSSProperties } from 'vue';

  const SVG_END_WITH_FLAG = '|svg';
  export default defineComponent({
    name: 'Icon',
    components: { SvgIcon },
    props: iconProps,
    setup(props) {
      const elRef = ref<any>(null);

      const isSvgIcon = computed(() => props.icon?.endsWith(SVG_END_WITH_FLAG));
      const getSvgIcon = computed(() =>
        props.icon?.replace(SVG_END_WITH_FLAG, '')
      );
      const getIconRef = computed(
        () => `${props.prefix ? `${props.prefix}:` : ''}${props.icon || ''}`
      );

      const update = async () => {
        if (unref(isSvgIcon)) return;

        const el = unref(elRef);
        if (!el) return;

        await nextTick();
        const icon = unref(getIconRef);
        if (!icon) return;

        const svg = '';
        if (svg) {
          el.textContent = '';
          el.appendChild(svg);
        } else {
          const span = document.createElement('span');
          span.className = 'iconify';
          span.dataset.icon = icon;
          el.textContent = '';
          el.appendChild(span);
        }
      };

      const getWrapStyle = computed((): CSSProperties => {
        const { size, color } = props;
        let fs = size;
        if (isString(size)) {
          fs = parseInt(size, 10);
        }

        return {
          fontSize: `${fs}px`,
          color,
          display: 'inline-flex',
        };
      });

      watch(() => props.icon, update, { flush: 'post' });

      onMounted(update);

      return { elRef, getWrapStyle, isSvgIcon, getSvgIcon, getIconRef };
    },
  });
</script>
<style lang="scss">
  .app-iconify {
    display: inline-block;

    &-spin {
      svg {
        animation: loadingCircle 1s infinite linear;
      }
    }
  }

  span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    border-radius: 100%;
  }
</style>
