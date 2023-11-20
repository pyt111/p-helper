import { h, toRaw } from 'vue';
import EditableCell from './EditableCell.vue';
import type { Ref } from 'vue';
import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

export type EditRowRecordRow<T = Recordable> = {
  rowKeyName: string | number;
} & T;
export type EditRecordRow<T = Recordable> = Partial<
  {
    onValid: () => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Record<string, Fn>;
    cancelCbs: Record<string, Fn>;
    validCbs: Fn[];
    onCancelEdit: Fn;
    onSubmitEdit: Fn;
    editValueRefs: Recordable<Ref>;
    rowKey: string | number;
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
  } & EditRowRecordRow &
    T & {
      [key: string]: any;
    }
>;

export interface Params {
  row: any;
  index: number;
  record: EditRecordRow;
  elColumn?: Record<string, any>;
}
export interface TableActionParams {
  row: any;
  index: number;
  record: EditRowRecordRow;
  elColumn?: Record<string, any>;
}

export function renderEditCell(column: BasicColumn) {
  return ({ row, index, record, elColumn }: Params) => {
    toRaw(record).onValid = async () => {
      if (record?.validCbs) {
        const validFns = Object.values(record?.validCbs).map((fn) => fn());
        const res = await Promise.all(validFns);
        return res.every((item) => !!item);
      } else {
        return false;
      }
    };
    toRaw(record).onEdit = async (edit: boolean, submit = false) => {
      if (!edit) {
        // 关闭重置，
        record._editableValue = null;
      }
      if (!submit) {
        record.editable = edit;
      }

      if (!edit && submit) {
        if (!(await record.onValid?.())) return false;
        const res = await record.onSubmitEdit?.();
        if (res) {
          record.editable = false;
          return true;
        }
        return false;
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.();
      }
      return true;
    };

    // 在编辑行状态编辑时，保存当前数据，在表格数据更新导致的新增或删除表格时，可以重新填入
    const saveEditableValue = (value) => {
      record._editableValue = Object.assign(record._editableValue || {}, {
        [column.prop as string]: value,
      });
    };

    return h(EditableCell, {
      key: index,
      value: row,
      index,
      record,
      column,
      elColumn,
      saveEditableValue,
    });
  };
}
