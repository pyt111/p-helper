<template>
  <div :class="prefixCls">
    <div
      v-show="!isEdit || !editButtonShow"
      :class="{
        [`${prefixCls}__normal`]: true,
        'ellipsis-cell': column.ellipsis,
      }"
      @click="handleEdit"
    >
      <div class="cell-content" :title="column.ellipsis ? getValues ?? '' : ''">
        <template v-if="props.column.editRender">
          <VNodeRenderer :node="props.column.editRender(getEmitParams)" />
        </template>
        <template v-else>
          {{ getValues || getValues === 0 ? getValues : '\u00A0' }}
        </template>
      </div>
      <template v-if="editButtonShow && column.edit">
        <el-icon
          :class="[
            `${prefixCls}__normal-icon`,
            `${column.editAlwaysShow ? 'always-show-icon' : ''}`,
          ]"
          @click="handleEdit"
        >
          <Edit />
        </el-icon>
      </template>
    </div>

    <div v-if="isEdit && editButtonShow" v-loading="isLoading">
      <div v-click-outside="onClickOutside" :class="`${prefixCls}__wrapper`">
        <CellComponent
          v-bind="getComponentProps"
          ref="elRef"
          :class="getWrapperClass"
          :component="getComponent"
          :style="getWrapperStyle"
          @change="handleChange"
          @keyup.enter="handleEnter"
          @options-change="handleOptionsChange"
        />
        <div
          v-if="
            !getRowEditable &&
            !isAlwaysBright &&
            !isEditRow &&
            editDecisionButtonShow
          "
          :class="`${prefixCls}__action`"
        >
          <el-icon
            :class="[`${prefixCls}__icon`, 'mx-2px']"
            @click="handleSubmitClick"
          >
            <Check />
          </el-icon>
          <el-icon :class="`${prefixCls}__icon `" @click="handleCancel">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref, shallowRef, unref, watchEffect } from 'vue';
  import { omit, pick, set } from 'lodash-es';
  import { isArray, isBoolean, isFunction, isNumber } from '@p-helper/utils/is';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  // import { treeToList } from '@p-helper/utils/helper/treeHelper';
  import ClickOutside from '@p-helper/utils/directives/clickOutside';
  import { syncProp } from '@p-helper/hooks';
  import VNodeRenderer from '@p-helper/components/VNodeRenderer';
  import { Check, Close, Edit } from '@element-plus/icons-vue';
  import { useTableContext } from '../../hooks/useTableContext';
  import { createPlaceholderMessage } from './helper';
  import { CellComponent } from './CellComponent';
  import type { EditRowKey } from '../../hooks/useColumns';
  import type { BasicColumn } from '@p-helper/components/Table/src/types/table';
  import type { CurrencyParams } from '@p-helper/components/Table/src/props';
  import type { EditRecordRow } from '@p-helper/components/Table/src/components/editable';
  import type { CSSProperties } from 'vue';

  const vClickOutside = ClickOutside;

  const props = defineProps({
    value: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({} as Record<string, any>),
    },
    index: {
      type: Number,
    },
    rowKey: {
      type: [Number, String],
    },
    record: {
      type: Object as PropType<EditRecordRow>,
      default: () => ({}),
    },
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({}),
    },
    elColumn: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
  });

  const innerValue = syncProp(props, 'value');

  const table = useTableContext();
  const elRef = ref();
  const componentRef = ref();
  const isEdit = ref(false);
  const isLoading = ref(false);
  const ruleMessage = ref('');
  const optionsRef = ref<LabelValueOptions>([]);
  const currentValueRef = ref<any>(
    props.column?.prop ? props.value[props.column?.prop] : props.value
  );
  const defaultValueRef = ref<any>(
    props.column?.prop ? props.value[props.column?.prop] : props.value
  );

  const { prefixCls } = useDesign('editable-cell');

  const getComponent = computed(() => props.column?.editComponent || 'Input');
  const getRowEditable = computed(() => {
    const { editable } = props.record || {};
    return !!editable;
  });

  const getEmitParams = computed(() => ({
    row: props.value,
    column: props.column,
    index: props.index,
    record: props.record,
    prop: props.column?.prop,
    elColumn: props.elColumn,
  }));

  // 根据业务条件判断【列中某单元格】是否开启编辑
  const editButtonShow = computed(() => {
    const { editFilterShow } = props.column;

    if (isFunction(editFilterShow)) {
      return editFilterShow(unref(getEmitParams));
    } else if (isBoolean(editFilterShow)) {
      return editFilterShow;
    }
    return true;
  });

  const editDecisionButtonShow = computed(() => {
    const { editDecisionButtonShow, editIsUpdateOnChange } = props.column;
    if (editIsUpdateOnChange) return false;
    if (isFunction(editDecisionButtonShow)) {
      return editDecisionButtonShow(unref(getEmitParams));
    } else if (isBoolean(editDecisionButtonShow)) {
      return editDecisionButtonShow;
    }
    return true;
  });

  const isAlwaysBright = computed(() => {
    const { alwaysBright } = props.column;
    if (isFunction(alwaysBright)) {
      return alwaysBright(unref(getEmitParams));
    } else if (isBoolean(alwaysBright)) {
      return alwaysBright;
    }
    return false;
  });

  const isEditRow = ref(false);

  watchEffect(() => {
    const { editable } = props.column;
    if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
      isEdit.value =
        (!!editable || unref(getRowEditable) || unref(isAlwaysBright)) &&
        editButtonShow.value;
    }
  });

  const getIsCheckComp = computed(() => {
    const component = unref(getComponent);
    return ['Checkbox', 'Switch'].includes(component);
  });

  const transformBoolean = (val) => {
    return isNumber(val) && isBoolean(val) ? val : !!val;
  };

  const getComponentProps = computed(() => {
    const compProps = props.column?.editComponentProps ?? {};

    const { editSlots } = props.column;
    const isCheckValue = unref(getIsCheckComp);

    const valueField = 'modelValue';
    const val = unref(currentValueRef);

    const value = isCheckValue ? transformBoolean(val) : val;

    return {
      size: 'small',
      componentRef,
      placeholder: createPlaceholderMessage(unref(getComponent)),
      'onUpdate:modelValue': (value) => {
        currentValueRef.value = value;
      },
      editSlots,
      ...omit(compProps, 'onChange'),
      [valueField]: value,
    };
  });

  const getValues = computed(() => {
    const { editComponentProps, editValueMap } = props.column;

    const value = unref(currentValueRef);

    if (editValueMap && isFunction(editValueMap)) {
      return editValueMap(value, {
        ...unref(getEmitParams),
        value,
      });
    }

    const component = unref(getComponent);
    if (!component.includes('Select')) {
      return value;
    }

    const options: LabelValueOptions =
      editComponentProps?.options ?? (unref(optionsRef) || []);
    const option = options.find((item) => `${item.value}` === `${value}`);

    return option?.label ?? value;
  });

  const getWrapperClass = computed(() => {
    const { align = 'center' } = props.column;
    return `edit-cell-align-${align}`;
  });

  const getWrapperStyle = computed((): CSSProperties => {
    if (unref(getIsCheckComp) || unref(getRowEditable)) {
      return {};
    }
    return {
      width: 'calc(100% - 48px)',
    };
  });

  watchEffect(() => {
    defaultValueRef.value = props.column?.prop
      ? props.value[props.column?.prop]
      : props.value;
    currentValueRef.value = props.column?.prop
      ? props.value[props.column?.prop]
      : props.value;
  });

  function handleEdit() {
    if (!unref(editButtonShow)) return;
    if (unref(getRowEditable) || unref(props.column?.editRow)) return;
    ruleMessage.value = '';
    isEdit.value = true;
    nextTick(() => {
      const el = unref(componentRef);
      el?.focus?.();
    });
  }

  const onChangeEmit = (config: CurrencyParams, ...args) => {
    const { onChange } = props.column?.editComponentProps || {};
    if (onChange && isFunction(onChange)) {
      onChange(config, ...args);
    }
  };

  async function handleChange(...args) {
    const isCheckValue = unref(getIsCheckComp);
    const { alwaysBright, editIsUpdateOnChange } = props.column;

    // 常亮编辑 并且同步数据
    if (
      alwaysBright ||
      editIsUpdateOnChange // 是否实时更新
    ) {
      try {
        await handleSubmit();
        onChangeEmit(unref(getEmitParams), ...args);
      } catch (err) {
        // 选框累的需要恢复初始值
        if (isCheckValue) {
          currentValueRef.value = defaultValueRef.value;
        }
        return;
      }
    } else {
      onChangeEmit(unref(getEmitParams), ...args);
    }

    table.emit?.('edit-change', {
      value: unref(currentValueRef),
      ...unref(getEmitParams),
    });
  }

  function handleOptionsChange(options: LabelValueOptions) {
    // const { props } = props.column?.editComponentProps ?? {};
    // const component = unref(getComponent);
    // if (component === 'TreeSelect') {
    //   const {
    //     label = 'label',
    //     value = 'value',
    //     children = 'children',
    //   } = props || {};
    //   let listOptions: Recordable[] = treeToList(options, { children });
    //   listOptions = listOptions.map((item) => {
    //     return {
    //       label: item[label],
    //       value: item[value],
    //     };
    //   });
    //   optionsRef.value = listOptions as LabelValueOptions;
    // } else {
    //
    // }
    optionsRef.value = options;
  }

  // 找到当前操作的行
  const isCheckedRow = (key: (string | number)[], isIndex = false) => {
    const rowKey = props.rowKey;
    const findIndex = key.findIndex((k) => k === rowKey);
    return findIndex >= 0;
  };

  async function handleSubmit(
    needEmit = true,
    key?: EditRowKey,
    isIndex?: boolean
  ) {
    const { column, value: row, record } = props;
    if (!record) return false;

    const { prop } = column;
    const value = unref(currentValueRef);
    if (!prop) return;
    if (isArray(key) && isEditRow.value) {
      const isFind = isCheckedRow(key, isIndex);
      if (!isFind) return;
    }
    if (!record.editable) {
      const { getBindValues } = table;

      const bindValues = unref(getBindValues);

      const { columns } = bindValues;
      // 默认使用editComponentProps的配置
      let beforeEditSubmit = props.column.editComponentProps?.beforeEditSubmit;

      if (!beforeEditSubmit) {
        beforeEditSubmit = bindValues.beforeEditSubmit;
      }

      if (beforeEditSubmit && isFunction(beforeEditSubmit)) {
        const keys: string[] = columns
          .map((_column) => _column.prop)
          .filter((field) => !!field) as string[];
        isLoading.value = true;
        let result: any = true;
        try {
          result = await beforeEditSubmit({
            record: pick(record, keys),
            index: props.index,
            row,
            prop,
            column,
            value,
          });
        } catch (e) {
          result = false;
        } finally {
          isLoading.value = false;
        }
        if (result === false) {
          return Promise.reject();
        }
      }
    }

    set(record, prop, value);

    // 此处需要先走完当前周期  element的select钩子调用有问题  在清空选项时
    await nextTick();
    // const record = await table.updateTableData(index, prop, value);
    innerValue.value[prop] = value; // 更新数据
    needEmit && table.emit?.('edit-end', unref(getEmitParams));
    isEdit.value = unref(getRowEditable) || unref(isAlwaysBright);
  }

  async function handleEnter() {
    if (props.column?.editRow || props.column?.alwaysBright) {
      return;
    }
    handleSubmit();
  }

  function handleSubmitClick() {
    handleSubmit();
  }

  function handleCancel(key?: (string | number)[], isIndex?: boolean) {
    if (isArray(key) && !isCheckedRow(key, isIndex)) return;
    isEditRow.value = false;
    isEdit.value = false;
    currentValueRef.value = defaultValueRef.value;
    table.emit?.('edit-cancel', {
      ...unref(getEmitParams),
      value: unref(currentValueRef),
    });
  }

  function onClickOutside() {
    if (props.column?.editable || unref(getRowEditable) || isEditRow.value) {
      return;
    }
    const component = unref(getComponent);

    if (component.includes('Input')) {
      handleCancel();
    }
  }

  function onEditRow(keys?: EditRowKey[], isIndex = false) {
    const { cacheEditRows } = props.record;
    isEditRow.value = unref(cacheEditRows)[props.rowKey!];
    isEdit.value = isEditRow.value;
    // const { cacheEditRows } = props.record;
    // // console.log('isIndex >--->', keys, isIndex, unref(cacheEditRows));
    // const isExist = keys.find((key) => {
    //   return unref(cacheEditRows)[key];
    // });
    // isEditRow.value = !!isExist;
    // isEdit.value = isEditRow.value;
  }

  function initCbs(
    cbs: 'submitCbs' | 'validCbs' | 'cancelCbs' | 'editRowCbs',
    handle: Fn
  ) {
    if (props.record) {
      /* eslint-disable  */
      isArray(props.record[cbs])
        ? props.record[cbs]?.push(handle)
        : (props.record[cbs] = [handle]);
    }
  }

  if (props.record) {
    initCbs('submitCbs', handleSubmit);
    // initCbs('validCbs', handleSubmiRule);
    initCbs('cancelCbs', handleCancel);
    initCbs('editRowCbs', onEditRow);

    if (props.column?.prop) {
      if (!props.record.editValueRefs) props.record.editValueRefs = {};
      props.record.editValueRefs[props.column.prop as any] = currentValueRef;
    }
    /* eslint-disable  */
    props.record.onCancelEdit = (key, isIndex) => {
      isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn) => fn(key, isIndex));
    };
    /* eslint-disable */
    props.record.onSubmitEdit = async (key, isIndex) => {
      if (isArray(props.record?.submitCbs)) {
        if (props.record?.onValid && !await props.record?.onValid?.()) return;
        const submitFns = props.record?.submitCbs || [];
        submitFns.forEach((fn) => fn(false, key, isIndex));
        table.emit?.('edit-row-end', unref(getEmitParams));
        return true;
      }
    };

    // 编辑行
    props.record.onEditRow = async (key?: EditRowKey, isIndex?: boolean) => {
      await nextTick(() => {
        isArray(props.record?.editRowCbs) && props.record?.editRowCbs.forEach((fn) => fn(key, isIndex));
      })
    }

    props.record.onEditRowSave = async (key?: EditRowKey, isIndex?: boolean) => {
      await props.record.onSubmitEdit(key, isIndex)
    }

    props.record.onEditRowCancel = async (key?: EditRowKey, isIndex?: boolean) => {
      await props.record.onCancelEdit(key, isIndex)
    }
  }

</script>
