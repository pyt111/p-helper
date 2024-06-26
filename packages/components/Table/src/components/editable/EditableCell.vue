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
          v-if="!getRowEditable && !isUpdateOnChange && editDecisionButtonShow"
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
  import {
    computed,
    nextTick,
    ref,
    shallowRef,
    unref,
    watch,
    watchEffect,
  } from 'vue';
  import { omit, pick, set } from 'lodash-es';
  import {
    isArray,
    isBoolean,
    isFunction,
    isNumber,
    isObject,
    isString,
  } from '@p-helper/utils/is';
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
  import type { CSSProperties, PropType } from 'vue';

  const vClickOutside = ClickOutside;

  const props = defineProps({
    value: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({} as Record<string, any>),
    },
    index: {
      type: Number,
    },
    record: {
      type: Object as any,
    },
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({}),
    },
    elColumn: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    saveEditableValue: {
      type: Function,
    },
  });

  const innerValue = syncProp(props, 'value');

  const table = useTableContext();
  const elRef = ref();
  const componentRef = ref();
  const isEdit = ref(false);
  const ruleVisible = ref(false);
  const isLoading = ref(false);
  const ruleMessage = ref('');
  const optionsRef = ref<LabelValueOptions>([]);
  const currentValueRef = ref<any>(props.value);
  const defaultValueRef = ref<any>(props.value);

  const { prefixCls } = useDesign('editable-cell');

  const getComponent = computed(() => props.column?.editComponent || 'Input');
  const getRowEditable = computed(() => {
    const { editable } = props.record || {};
    return !!editable;
  });

  watch(
    () => getRowEditable.value,
    (val) => {
      const _editableValue =
        props.record._editableValue?.[props.column.prop as string];
      if (val && _editableValue) {
        currentValueRef.value = _editableValue;
      }
    }
  );

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
    const { editDecisionButtonShow } = props.column;
    if (isFunction(editDecisionButtonShow)) {
      return editDecisionButtonShow(unref(getEmitParams));
    } else if (isBoolean(editDecisionButtonShow)) {
      return editDecisionButtonShow;
    }
    return true;
  });

  const isUpdateOnChange = computed(() => {
    const { alwaysBright } = props.column;
    if (isFunction(alwaysBright)) {
      return alwaysBright(unref(getEmitParams));
    } else if (isBoolean(alwaysBright)) {
      return alwaysBright;
    }
    return false;
  });

  watchEffect(() => {
    const { editable, label } = props.column;
    if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
      isEdit.value =
        (!!editable || unref(getRowEditable) || unref(isUpdateOnChange)) &&
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

  const getEditComponentProps = computed(() => {
    const value = unref(currentValueRef);
    let compProps = props.column?.editComponentProps ?? ({} as any);

    const { record, column, index } = props;

    if (isFunction(compProps)) {
      compProps = compProps({ value, record, column, index }) ?? {};
    }
    return compProps;
  });

  const getComponentProps = computed(() => {
    const { editSlots } = props.column;
    const valueField = 'modelValue';
    const val = unref(currentValueRef);
    const compProps = unref(getEditComponentProps);

    // 用临时变量存储 onChange方法 用于 handleChange方法 获取，并删除原始onChange, 防止存在两个 onChange
    if (compProps.onChange) {
      compProps.onChangeTemp = compProps.onChange;
      delete compProps.onChange;
    }

    return {
      size: 'small',
      componentRef,
      placeholder: createPlaceholderMessage(unref(getComponent)),
      'onUpdate:modelValue': (value) => {
        currentValueRef.value = value;
      },
      editSlots,
      ...compProps,
      [valueField]: val,
    };
  });

  const getValues = computed(() => {
    const { editValueMap } = props.column;

    const value = unref(currentValueRef);

    if (editValueMap && isFunction(editValueMap)) {
      return editValueMap(value);
    }

    const component = unref(getComponent);
    if (!component.includes('Select')) {
      return value;
    }

    const compProps = unref(getEditComponentProps);
    const options: LabelValueOptions =
      compProps?.options ?? (unref(optionsRef) || []);
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
    const onChange = unref(getComponentProps)?.onChangeTemp;
    if (onChange && isFunction(onChange)) onChange(config, ...args);
  };

  async function handleChange(e, ...args) {
    const component = unref(getComponent);
    if (!e) {
      currentValueRef.value = e;
    } else if (component === 'Switch') {
      currentValueRef.value = e;
    } else if (isString(e) || isBoolean(e) || isNumber(e) || isArray(e)) {
      currentValueRef.value = e;
    }

    // 这里为了保存编辑行状态下编辑的数据
    if (getRowEditable.value) {
      props.saveEditableValue?.(currentValueRef.value);
    }

    // 常亮编辑 并且同步数据
    if (isUpdateOnChange.value) {
      try {
        await handleSubmit();
        onChangeEmit(unref(getEmitParams), e, ...args);
      } catch (err) {
        return;
      }
    } else {
      onChangeEmit(unref(getEmitParams), e, ...args);
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

  async function handleSubmit(needEmit = true) {
    const { column, value: row, record } = props;
    if (!record) return false;

    const { prop } = column;
    const value = unref(currentValueRef);
    if (!prop) return;
    if (!record.editable) {
      const { getBindValues } = table;

      const bindValues = unref(getBindValues);
      const compProps = unref(getEditComponentProps);

      const { columns } = bindValues;
      // 默认使用editComponentProps的配置
      let beforeEditSubmit = compProps?.beforeEditSubmit;

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
    isEdit.value = unref(getRowEditable) || unref(isUpdateOnChange);
  }

  async function handleEnter() {
    if (props.column?.editRow || isUpdateOnChange.value) {
      return;
    }
    handleSubmit();
  }

  function handleSubmitClick() {
    handleSubmit();
  }

  function handleCancel() {
    isEdit.value = false;
    currentValueRef.value = defaultValueRef.value;
    table.emit?.('edit-cancel', {
      ...unref(getEmitParams),
      value: unref(currentValueRef),
    });
  }

  function onClickOutside() {
    if (
      props.column?.editable ||
      unref(getRowEditable) ||
      unref(isUpdateOnChange)
    ) {
      return;
    }
    const component = unref(getComponent);

    if (component.includes('Input')) {
      handleCancel();
    }
  }

  async function handleSubmitRule() {
    const { column, record } = props;
    const { editRule } = column;
    const currentValue = unref(currentValueRef);

    if (editRule) {
      if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
        ruleVisible.value = true;
        const component = unref(getComponent);
        ruleMessage.value = createPlaceholderMessage(component);
        return false;
      }
      if (isFunction(editRule)) {
        const res = await editRule(currentValue, record);
        if (res) {
          ruleMessage.value = res;
          ruleVisible.value = true;
          return false;
        } else {
          ruleMessage.value = '';
          return true;
        }
      }
    }
    ruleMessage.value = '';
    return true;
  }

  function initCbs(
    cbs: 'submitCbs' | 'validCbs' | 'cancelCbs' | 'editRowCbs',
    handle: Fn
  ) {
    if (props.record) {
      const targetRowKeyName = props.column.prop as string;
      /* eslint-disable  */
      props.record[cbs]
        ? props.record[cbs][targetRowKeyName] = handle
        : props.record[cbs] = {
            [targetRowKeyName]: handle,
          };
    }
  }

  watch(() => props.record.key, () => {

    if (props.record) {
      initCbs('submitCbs', handleSubmit);
      initCbs('validCbs', handleSubmitRule);
      initCbs('cancelCbs', handleCancel);

      if (props.column?.prop) {
        if (!props.record.editValueRefs) props.record.editValueRefs = {};
        props.record.editValueRefs[props.column.prop as any] = currentValueRef;
      }
      /* eslint-disable  */
      props.record.onCancelEdit = () => {
        if (props.record?.cancelCbs) {
          const cancelCbs = props.record?.cancelCbs || {};

          for (const key in cancelCbs) {
            cancelCbs[key]();
          }
        }
      };
      /* eslint-disable */
      props.record.onSubmitEdit = async () => {
        if (props.record?.submitCbs) {
          if (props.record?.onValid && !await props.record?.onValid?.()) return;
          const submitFns = props.record?.submitCbs || {};
          for (const submitFnsKey in submitFns) {
            submitFns[submitFnsKey](false, false);
          }
          table.emit?.('edit-row-end', unref(getEmitParams));
          return true;
        }
      };
    }
  }, {immediate: true, deep: true})

</script>
