import { h } from 'vue';
import { omit } from 'lodash-es';
import { CustomCellComponent } from './components/custom/CustomCellComponent';
import type { BasicColumn, TableComponentTypes } from './types/table';
import type { PropType } from 'vue';

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
  const renderCustomCell = ({ row, column, $index }) => {
    return h(CustomCellComponent, {
      row,
      index: $index,
      record: props.column.record || {},
      elColumn: column,
      component: props.column.component,
      componentProps: props.column.componentProps,
    });
  };

  const renderEditColumn = ({ row, column, $index }) => {
    if (props.column.component && !props.column.editRender) {
      props.column.editRender = ({
        row: _row,
        column: _column,
        index: _index,
      }) =>
        renderCustomCell({
          row: _row,
          column: _column,
          $index: _index,
        });
    }
    return props.column.customRender!({
      row,
      index: $index,
      record: props.column.record || {},
      elColumn: column,
    });
  };

  if (props.column.children) {
    const p = omit(props.column, ['children', 'columnSlots']);
    return RenderColumn(
      { column: p as BasicColumn },
      {
        slots: {
          default: (obj) => {
            return props.column.children?.map((item) => {
              return BasicColumnComponent({ column: item });
            });
          },
          ...props.column.columnSlots,
        },
      }
    );
  }

  if (props.column.customRender) {
    return RenderColumn(props, {
      slots: {
        default: renderEditColumn,
        ...props.column.columnSlots,
      } as any,
    });
  }

  if (props.column.component) {
    return RenderColumn(props, {
      slots: {
        default: renderCustomCell,
        ...props.column.columnSlots,
      },
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
