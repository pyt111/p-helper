import { computed, h, toRaw } from 'vue';
import { isObject } from 'lodash-es';
import Icon from '@p-helper/components/Icon/src/Icon.vue';
import { ElIcon } from 'element-plus';
import { iconProps } from './props';
import type { ExtractPropTypes, FunctionalComponent } from 'vue';
export const ActionIcon = (
  props: ExtractPropTypes<typeof iconProps>,
  { attrs }
) => {
  const className = props.order ? `button-icon--${props.order}` : '';

  // 规范化icon
  const normalizeIcon = (icon) => {
    if (!icon) {
      return;
    }
    if (isObject(icon)) {
      return toRaw(icon);
    }
    const iconStr = icon;
    if (iconStr) {
      return iconStr.endsWith('|svg') ? iconStr : `${iconStr}|svg`;
    }
    return '';
  };

  const iconEl = computed(() => normalizeIcon(props.icon));

  if (isObject(iconEl.value)) {
    return h(
      // @ts-ignore
      ElIcon,
      {
        color: props.color,
        size: props.iconSize,
        class: className,
      },
      // @ts-ignore
      iconEl.value?.render
    );
  }
  // @ts-ignore
  return h(Icon, {
    icon: iconEl.value,
    size: props.iconSize,
    color: props.color,
    class: className,
    ...attrs,
  });
};

ActionIcon.props = iconProps;
