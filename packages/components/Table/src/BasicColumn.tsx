import { h } from 'vue';
import { isFunction, omit } from 'lodash-es';
import { CustomCellComponent } from './components/custom/CustomCellComponent';
import type { EditRecordRow } from './components/editable';
import type { BasicColumn, TableComponentTypes } from './types/table';
import type { PropType } from 'vue';

type FComponentProps = {
  recordCache: Object;
  getRowKeyName: () => string;
  slots: any;
};

type BasicFComponentProps = {
  column: BasicColumn;
};

const formatter = (_row, _style, val) => {
  return val ?? '--';
};

export const RenderColumn = (
  props: BasicFComponentProps,
  context?
): TableComponentTypes | null | undefined | void => {
  // console.log('context?.slots >--->', context?.slots);
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

const BasicColumnComponent = (
  props: BasicFComponentProps & FComponentProps
) => {
  const renderCustomCell = ({ row, column, $index }) => {
    return h(CustomCellComponent, {
      row,
      prop: props.column.prop,
      index: $index,
      record: props.column.record || {},
      elColumn: column,
      component: props.column.component,
      componentProps: props.column.componentProps,
    });
  };

  const renderEditColumn = ({ row, column: elColumn, $index }) => {
    if (props.column.component && !props.column.editRender) {
      props.column.editRender = ({
        row: _row,
        column,
        elColumn: _elColumn,
        index: _index,
      }) => {
        return renderCustomCell({
          row: _row,
          column: _elColumn,
          $index: _index,
        });
      };
    }
    const rowKey = props.getRowKeyName();
    // console.log('elColumn+++++ >--->', elColumn, props.column.prop);
    const record = props.recordCache[row[rowKey]] || {};
    return props.column.customRender!({
      row,
      index: $index,
      record,
      elColumn,
    });
  };

  if (props.column.children) {
    const p: any = omit(props.column, ['children', 'columnSlots']);
    return RenderColumn(
      { column: p as BasicColumn },
      {
        slots: {
          default: (obj) => {
            return props.column.children?.map((item) => {
              return BasicColumnComponent({
                column: item,
                getRowKeyName: props.getRowKeyName,
                recordCache: props.recordCache,
                slots: props.slots,
              });
            });
          },
          ...props.column.columnSlots,
        },
      }
    );
  }

  if (props.slots && props.column.prop && props.slots[props.column.prop]) {
    const rowKey = props.getRowKeyName();

    return RenderColumn(props, {
      slots: {
        default: (obj) => {
          const record = props.recordCache[obj.row[rowKey]] || {};
          return props.slots[props.column.prop!]({ ...obj, record });
        },
      },
    });
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

  return RenderColumn(props, {
    slots: {
      ...props.column.columnSlots,
    },
  });
};

BasicColumnComponent.props = {
  column: {
    type: Object as PropType<BasicColumn>,
    required: true,
  },
  recordCache: {
    type: Object as PropType<Recordable & EditRecordRow>,
    default: () => ({}),
  },
  getRowKeyName: {
    type: Function,
  },
  slots: {
    type: Object as PropType<any>,
  },
};

RenderColumn.props = {
  column: {
    type: Object as PropType<BasicColumn>,
    required: true,
  },
};
export default BasicColumnComponent;
