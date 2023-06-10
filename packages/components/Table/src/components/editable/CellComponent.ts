import { h } from 'vue';
import { componentMap } from '../../../componentMap';
import type { FunctionalComponent, defineComponent } from 'vue';
import type { ComponentType } from '../../types/componentType';

import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

export interface ComponentProps {
  component: ComponentType;
  rule: boolean;
  popoverVisible: boolean;
  ruleMessage: string;
  getPopupContainer?: Fn;
}

// @ts-ignore
export const CellComponent: FunctionalComponent = (
  { component = 'Input' }: ComponentProps,
  { attrs }
) => {
  const Comp = componentMap.get(component) as typeof defineComponent;

  const { editSlots } = attrs;

  // @ts-ignore
  return h(Comp, attrs, editSlots as BasicColumn['editSlots']);
};
