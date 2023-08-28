import { h } from 'vue';
import { isObject } from 'lodash-es';
import Icon from '@p-helper/components/Icon/src/Icon.vue';
import { ElIcon } from 'element-plus';
import type { iconProps } from './props';
import type { FunctionalComponent } from 'vue';
export const ActionIcon: FunctionalComponent<typeof iconProps> = (props) => {
  const className = `button-icon--${props.name}`;
  if (isObject(props.icon)) {
    return h(
      // @ts-ignore
      ElIcon,
      {
        color: props.color,
        size: props.iconSize,
        class: className,
      },
      () => props.icon
    );
  }
  // @ts-ignore
  return h(Icon, {
    icon: props.icon,
    size: props.iconSize,
    color: props.color,
    class: className,
  });
};
