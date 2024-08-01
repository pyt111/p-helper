import { h } from 'vue';
import { ElInput, ElSwitch } from 'element-plus';
import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

export const TABLE_CELL_STATUS_SUFFIX = 'CUSTOM_STATUS';

export const updateTableCellStatusKey = (key?: string) => {
  if (!key) {
    return '';
  }
  return `__${key.toLocaleUpperCase()}_${TABLE_CELL_STATUS_SUFFIX}__`;
};

export const useTableCellVNode = () => {
  const setStatus = <T>(row: T, col: BasicColumn) => {
    const key = updateTableCellStatusKey(col.prop);
    if (key) {
      row[key] = undefined;
    }
  };

  const Input = <T>(row: T, col: BasicColumn) => {
    return h(ElInput, {
      modelValue: row[col.prop!],
      'onUpdate:modelValue': (value) => {
        row[col.prop!] = value;
      },
      onBlur: () => {
        setStatus(row, col);
      },

      onChange: () => {
        setStatus(row, col);
      },
    });
  };

  const Switch = <T>(row: T, col: BasicColumn) => {
    const { editComponentProps = {} } = col;

    return h(ElSwitch, {
      modelValue: row[col.prop!],
      'onUpdate:modelValue': (value) => {
        row[col.prop!] = value;
      },
      // ...componentProps,
      onChange: (value) => {
        // @ts-ignore
        if (typeof editComponentProps.onChange === 'function') {
          // @ts-ignore
          editComponentProps.onChange.call(null, value, row, col);
        }
      },
    });
  };

  return {
    Input,
    Switch,
  };
};
