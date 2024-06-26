import { h } from 'vue';
import { componentMap } from '../../../componentMap';
import type { FunctionalComponent, Ref, defineComponent } from 'vue';
import type { ComponentType } from '../../types/componentType';
import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

export interface ComponentProps {
  component: ComponentType;
  rule: boolean;
  popoverVisible: boolean;
  ruleMessage: string;
  getPopupContainer?: Fn;
  componentRef?: Ref<any>;
}

// @ts-ignore
export const CellComponent: FunctionalComponent = (
  {
    component = 'Input',
    componentRef,
    rule,
    ruleMessage,
    popoverVisible,
  }: ComponentProps,
  { attrs }
) => {
  const Comp = componentMap.get(component) as typeof defineComponent;
  const { editSlots } = attrs;
  const DefaultComp = h(
    // @ts-ignore
    Comp,
    {
      ...attrs,
      ref: componentRef,
    },
    editSlots as BasicColumn['editSlots']
  );

  return DefaultComp;
  // console.log('props >--->', popoverVisible);

  // return h(DefaultComp, {
  //   class: 'is-error',
  // });
  // @ts-ignore
  // return h(
  //   // @ts-ignore
  //   ElPopover,
  //   {
  //     visible: !!popoverVisible,
  //   },
  //   {
  //     reference: () => DefaultComp,
  //     default: () => ruleMessage,
  //   }
  // );
};
