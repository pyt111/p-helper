import { h } from 'vue';
import EditableCell from './EditableCell.vue';
import type { Ref } from 'vue';
import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    onValid: () => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Fn[];
    cancelCbs: Fn[];
    validCbs: Fn[];
    editValueRefs: Recordable<Ref>;
  } & T
>;

export interface Params {
  row: any;
  index: number;
  record: EditRecordRow;
  elColumn?: Record<string, any>;
}

export function renderEditCell(column: BasicColumn) {
  return ({ row, index, record }: Params) => {
    record.onEdit = async (edit: boolean, submit = false) => {
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

    return h(EditableCell, {
      value: row,
      index,
      record,
      column,
    });
  };
}
