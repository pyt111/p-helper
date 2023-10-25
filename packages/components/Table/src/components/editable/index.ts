import { h } from 'vue';
import EditableCell from './EditableCell.vue';
import type { EditRowKey } from '../../hooks/useColumns';
import type {
  BasicColumn,
  BasicTableProps,
} from '@p-helper/components/Table/src/types/table';
import type { ComputedRef, Ref, ShallowRef } from 'vue';

export type EditRowRecordRow<T = Recordable> = {
  onEditRow: (key?: EditRowKey, isIndex?: boolean) => Promise<any>;
  onEditRowSave: (key?: EditRowKey, isIndex?: boolean) => Promise<any>;
  onEditRowCancel: (key?: EditRowKey, isiIndex?: boolean) => Promise<any>;
  rowKeyName: string | number;
  updateTableActionUi: () => void;
  updateIndex: Ref<number>;
  isEditableRow: () => boolean;
  cacheEditRows: ShallowRef;
  getIsRowEditCacheRowKeys: () => string[];
} & T;
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
    rowKey: string | number;
  } & EditRowRecordRow &
    T
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

export function renderEditCell(
  column: BasicColumn,
  propsRef: ComputedRef<BasicTableProps>
) {
  return ({ row, index, record, elColumn }: Params) => {
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
      rowKey: row[record.rowKeyName!] ?? row.key,
      tableProps: propsRef.value,
      elColumn,
    });
  };
}
