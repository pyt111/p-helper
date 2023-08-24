import { Slot, h, ref } from 'vue';
import { omit } from 'lodash-es';
import { CustomCellComponent } from './components/custom/CustomCellComponent';
import type { BasicColumn, TableComponentTypes } from './types/table';
import type { FunctionalComponent, PropType, SetupContext, VNode } from 'vue';

type FComponentProps = {
  column: BasicColumn;
};

const formatter = (_row, _style, val) => {
  return val ?? '--';
};

export const RenderColumn = (
  props: FComponentProps,
  context?
): TableComponentTypes | null | undefined | void => {
  return (
    <el-table-column
      formatter={props.column.formatter || formatter}
      show-overflow-tooltip={true}
      {...props.column}
    >
      {{ ...context?.slots }}
    </el-table-column>
  );
};

const BasicColumnComponent = (props: FComponentProps) => {
  const renderEditColumn = ({ row, column, $index }) => {
    return props.column.customRender!({
      row,
      index: $index,
      record: props.column.record || {},
      elColumn: column,
    });
  };

  if (props.column.children) {
    const p = omit(props.column, ['children']);
    return RenderColumn(
      { column: p as BasicColumn },
      {
        slots: {
          default: () =>
            props.column.children?.map((item) => {
              return BasicColumnComponent({ column: item });
            }),
        },
      }
    );
  }

  if (props.column.component) {
    return RenderColumn(props, {
      slots: {
        default: ({ row, column, $index }) =>
          h(CustomCellComponent, {
            componentProps: props.column.componentProps,
            row,
            index: $index,
            record: props.column.record || {},
            elColumn: column,
            component: props.column.component,
          }),
      },
    });
  }

  if (props.column.customRender) {
    return RenderColumn(props, {
      slots: {
        default: renderEditColumn,
      } as any,
    });
  }

  return RenderColumn(props);
};

BasicColumnComponent.props = {
  column: {
    type: Object as PropType<BasicColumn>,
    required: true,
  },
};

RenderColumn.props = {
  column: {
    type: Object as PropType<BasicColumn>,
    required: true,
  },
};
export default BasicColumnComponent;
