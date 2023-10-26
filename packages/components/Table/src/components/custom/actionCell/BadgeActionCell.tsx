import { computed, defineComponent } from 'vue';
import { PopConfirmButton } from '@p-helper/components/Button';
import { ElBadge } from 'element-plus';
import { isFunction } from 'lodash-es';
import { useAction } from '../../../hooks/useAction';
import { badgeActionProps } from './props';
import type { ActionItem } from '@p-helper/components/Table/src/types/tableAction';

export default defineComponent({
  name: 'BadgeActionCell',
  props: badgeActionProps,
  setup(props, { slots, attrs }) {
    const { genPublicProps, getemitParams } = useAction(props);
    const getAction = computed(() => {
      return genPublicProps(props.componentProps as ActionItem);
    });

    let badgeValue: string | number = '';
    const badge = isFunction(getAction.value.badge)
      ? getAction.value.badge(getemitParams.value)
      : getAction.value.badge;
    if (badge) {
      if (isFunction(badge?.value)) {
        badgeValue = badge?.value(getemitParams.value) || '';
      } else {
        badgeValue = badge.valueKey
          ? getemitParams.value.row[badge.valueKey]
          : '';
      }
    }
    const renderContent = () => {
      return (
        <PopConfirmButton {...getAction.value}>
          {{
            default: () => getAction.value.label,
            suffix: getAction.value.badge
              ? () => {
                  return <ElBadge {...badge} value={badgeValue} />;
                }
              : null,
            ...slots,
          }}
        </PopConfirmButton>
      );
    };
    return () => renderContent();
  },
});
