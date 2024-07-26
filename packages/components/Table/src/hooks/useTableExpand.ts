import { computed, ref, toRaw, unref } from 'vue';
import { isBoolean } from 'lodash-es';
import { ROW_KEY } from '../const';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';

export function useTableExpand(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType
) {
  const expandRowKeys = ref<(string | number)[]>([]);
  const expandedRows = ref<any[]>([]);
  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : (rowKey as string);
  });

  const getExpandOption = computed(() => {
    return {
      expandRowKeys: expandRowKeys.value,
      rowKey: getRowKey.value, // expandRowKeys必须设置rowKey
    };
  });

  const onExpandChange = (row: any, expanded: any[] | boolean) => {
    if (!isBoolean(expanded)) {
      expandRowKeys.value = expanded.map((row: any) => row[getRowKey.value!]);
    }
    emit('expand-change', row, expanded);
  };

  function expandAll() {
    const keys = getAllKeys();
    expandRowKeys.value = keys;
  }

  function expandRows(keys: (string | number)[]) {
    const allKeys = [...expandRowKeys.value, ...keys];
    expandRowKeys.value = [...new Set(allKeys)];
  }

  function collapseRows(keys: (string | number)[]) {
    expandRowKeys.value = expandRowKeys.value.filter(
      (key) => !keys.includes(key)
    );
  }

  function getAllKeys(data?: Recordable[]) {
    const keys: string[] = [];
    const { childrenColumnName } = unref(propsRef);
    toRaw(data || unref(tableData)).forEach((item) => {
      keys.push(item[unref(getRowKey) as string]);
      const children = item[childrenColumnName || 'children'];
      if (children?.length) {
        keys.push(...getAllKeys(children));
      }
    });
    return keys;
  }

  function collapseAll() {
    expandRowKeys.value = [];
  }

  return {
    getExpandOption,
    expandAll,
    expandRows,
    collapseAll,
    collapseRows,
    onExpandChange,
  };
}
