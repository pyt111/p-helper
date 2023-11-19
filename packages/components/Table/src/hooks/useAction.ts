import { computed } from 'vue';
import { omit } from 'lodash-es';
import type { ActionItem } from '../types/tableAction';
import type { Params } from '../components/editable';

export const useAction = (props) => {
  const getemitParams = computed(() => {
    return {
      row: props.row,
      index: props.index,
      record: props.record,
      elColumn: props.elColumn,
    } as Params;
  });

  const genPublicProps = (action: ActionItem) => {
    const { popConfirm, onClick } = action;

    const propsActions = omit(action, 'ifShow');
    return {
      link: true,
      bg: false,
      ...propsActions,
      popConfirm: {
        ...popConfirm,
        onConfirm: popConfirm?.confirm.bind(null, getemitParams.value),
        onCancel: popConfirm?.cancel?.bind(null, getemitParams.value),
      },
      onClick: onClick?.bind(null, getemitParams.value),
      enablePopConfirm: !!popConfirm,
    };
  };

  return {
    genPublicProps,
    getemitParams,
  };
};
