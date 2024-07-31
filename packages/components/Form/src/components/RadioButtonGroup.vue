<template>
  <el-radio-group v-bind="attrs" v-model="modelValue">
    <template v-for="item in getOptions" :key="item.label">
      <el-radio-button :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </el-radio-button>
    </template>
  </el-radio-group>
</template>

<script lang="ts" setup>
  import { computed, useAttrs } from 'vue';
  import { isString } from 'lodash-es';
  import type { PropType } from 'vue';
  import type { RadioButtonProps, RadioGroupProps } from 'element-plus';

  defineOptions({
    name: 'RadioButtonGroup',
  });

  const props = defineProps({
    options: {
      type: Array as PropType<RadioButtonProps[]>,
      default: () => [] as RadioButtonProps[],
    },
  });
  const attrs = useAttrs();
  // @ts-nocheck
  const modelValue = defineModel({
    type: [String, Boolean, Number] as PropType<RadioGroupProps['modelValue']>,
    default: '',
  });

  const getOptions = computed((): RadioButtonProps[] => {
    const { options } = props;
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as RadioButtonProps[];

    return options.map((item) => ({
      label: item,
      value: item,
    })) as unknown as RadioButtonProps[];
  });
</script>
