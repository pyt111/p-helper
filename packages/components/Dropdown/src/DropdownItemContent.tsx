import { defineComponent } from 'vue';
import { PopConfirmButton } from '@p-helper/components/Button';
import type { PropType } from 'vue';
import type { ActionItem } from '../../Table';

export default defineComponent({
  name: 'DropdownItemContent',
  props: {
    action: {
      type: Object as PropType<ActionItem>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const renderContent = () => {
      return (
        <PopConfirmButton {...props.action}>{{ ...slots }}</PopConfirmButton>
      );
    };
    return () => renderContent();
  },
});
