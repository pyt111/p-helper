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
      <template v-if="editButtonShow">
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
          v-if="!getRowEditable && !isAlwaysBright"
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
  import { computed, nextTick, ref, unref, watchEffect } from 'vue';
  import { omit, pick, set } from 'lodash-es';
  import { isArray, isBoolean, isFunction, isNumber } from '@p-helper/utils/is';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import { treeToList } from '@p-helper/utils/helper/treeHelper';
  import ClickOutside from '@p-helper/utils/directives/clickOutside';
  import { syncProp } from '@p-helper/hooks';
  import VNodeRenderer from '@p-helper/components/VNodeRenderer';
  import { Check, Close, Edit } from '@element-plus/icons-vue';
  import { useTableContext } from '../../hooks/useTableContext';
  import { createPlaceholderMessage } from './helper';
  import { CellComponent } from './CellComponent';
  import type { CurrencyParams } from '@p-helper/components/Table/src/props';
  import type { EditRecordRow } from '@p-helper/components/Table/src/components/editable';
  import type { CSSProperties } from 'vue';
  import type { BasicColumn } from '@p-helper/components/Table/src/types/table';

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
      type: Object as PropType<EditRecordRow>,
      default: () => ({}),
    },
    column: {
      type: Object as PropType<BasicColumn>,
      default: () => ({}),
    },
  });

  const innerValue = syncProp(props, 'value');

  const table = useTableContext();
  const elRef = ref();
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

  const isAlwaysBright = computed(() => {
    const { alwaysBright } = props.column;
    if (isFunction(alwaysBright)) {
      return alwaysBright(unref(getEmitParams));
    } else if (isBoolean(alwaysBright)) {
      return alwaysBright;
    }
    return false;
  });

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
      const el = unref(elRef);
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
    const { alwaysBright } = props.column;

    // 常亮编辑 并且同步数据
    if (alwaysBright) {
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
    const { replaceFields } = props.column?.editComponentProps ?? {};
    const component = unref(getComponent);
    if (component === 'ApiTreeSelect') {
      const {
        title = 'title',
        value = 'value',
        children = 'children',
      } = replaceFields || {};
      let listOptions: Recordable[] = treeToList(options, { children });
      listOptions = listOptions.map((item) => {
        return {
          label: item[title],
          value: item[value],
        };
      });
      optionsRef.value = listOptions as LabelValueOptions;
    } else {
      optionsRef.value = options;
    }
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

  function handleCancel() {
    isEdit.value = false;
    currentValueRef.value = defaultValueRef.value;
    table.emit?.('edit-cancel', {
      ...unref(getEmitParams),
      value: unref(currentValueRef),
    });
  }

  function onClickOutside() {
    if (props.column?.editable || unref(getRowEditable)) {
      return;
    }
    const component = unref(getComponent);

    if (component.includes('Input')) {
      handleCancel();
    }
  }

  function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: Fn) {
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

    if (props.column?.prop) {
      if (!props.record.editValueRefs) props.record.editValueRefs = {};
      props.record.editValueRefs[props.column.prop as any] = currentValueRef;
    }
    /* eslint-disable  */
    props.record.onCancelEdit = () => {
      isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn) => fn());
    };
    /* eslint-disable */
    props.record.onSubmitEdit = async () => {
      if (isArray(props.record?.submitCbs)) {
        if (!props.record?.onValid?.()) return;
        const submitFns = props.record?.submitCbs || [];
        submitFns.forEach((fn) => fn(false, false));
        table.emit?.('edit-row-end');
        return true;
      }
    };
  }
</script>

<style lang="scss">
  .editable-cell {
    position: relative;

    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__icon {
      cursor: pointer;

      &:hover {
        transform: scale(1.2);

        svg {
          color: #222;
        }
      }
    }

    &__normal {
      &-icon {
        position: absolute;
        top: 4px;
        right: 0;
        display: none;
        width: 20px;
        cursor: pointer;

        &.always-show-icon {
          display: inline-block;
        }
      }
    }

    &:hover {
      .editable-cell {
        &__normal-icon {
          display: inline-block;
        }
      }
    }
  }
</style>
