import { defineComponent, h, isVNode, useAttrs, useSlots } from 'vue';
import { isFunction, isString } from 'lodash-es';
import { componentMap, customComponentMap } from '../../../componentMap';
import { ColumnTypesExpand } from '../../types/table';
import type { ComponentPropsFn, TableComponentTypes } from '../../types/table';
import type { DefineComponent } from '@vue/runtime-core';
import type {
  Component,
  ExtractPropTypes,
  FunctionalComponent,
  PropType,
  VNode,
} from 'vue';
import type {
  ComponentType,
  CustomComponentType,
} from '../../types/componentType';

const basicProps = {
  componentProps: {
    type: [Object, Function] as PropType<Recordable | ComponentPropsFn>,
  },
  component: {
    type: [String, Object] as PropType<TableComponentTypes>,
  },
  row: {
    type: Object as PropType<Recordable>,
  },
  column: {
    type: Object as PropType<Recordable>,
  },
  index: {
    type: Number as PropType<number>,
  },
};
export const CustomCellComponent = (
  props: ExtractPropTypes<typeof basicProps>,
  { attrs, slots }: any
): VNode | Component | JSX.Element | string => {
  // eslint-disable-next-line vue/no-setup-props-destructure
  let Comp: VNode | Component | JSX.Element | string = '';
  if (!props.component) {
    throw new Error(`CustomCellComponent => 未导入组件`);
  }
  const params = {
    row: props.row,
    column: props.column,
    index: props.index,
  };
  if (isFunction(props.component)) {
    // @ts-ignore
    Comp = props.component(params);
  }

  if (isVNode(Comp)) {
    return Comp;
  }
  if (
    isString(props.component) &&
    componentMap.has(props.component as ComponentType)
  ) {
    Comp = componentMap.get(props.component as ComponentType) as Component;
  } else if (customComponentMap.has(props.component as CustomComponentType)) {
    Comp = customComponentMap.get(
      props.component as CustomComponentType
    ) as Component;
  } else {
    return Comp; // 纯字符串
  }

  let componentProps = attrs.componentProps;
  if (componentProps && isFunction(componentProps)) {
    componentProps = attrs.componentProps(props);
  }
  return h(
    Comp,
    {
      ...props,
      ...attrs,
      ...componentProps,
    },
    slots
  );
};
