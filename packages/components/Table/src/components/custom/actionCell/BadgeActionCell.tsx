import { computed, defineComponent } from 'vue';
import { PopConfirmButton } from '@p-helper/components/Button';
import { ElBadge } from 'element-plus';
import { useAction } from '../../../hooks/useAction';
import { badgeActionProps } from './props';
import type { ActionItem } from '@p-helper/components/Table/src/types/tableAction';

export default defineComponent({
  name: 'BadgeActionCell',
  props: badgeActionProps,
  setup(props, { slots, attrs }) {
    const { genPublicProps } = useAction(props);
    const getAction = computed(() => {
      return genPublicProps(props.componentProps as ActionItem);
    });
    const renderContent = () => {
      return (
        <PopConfirmButton {...getAction.value}>
          {{
            default: () => getAction.value.label,
            suffix: getAction.value.badge
              ? () => {
                  return <ElBadge {...getAction.value.badge} />;
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
