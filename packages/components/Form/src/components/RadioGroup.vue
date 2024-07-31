<template>
  <el-radio-group v-bind="attrs" v-model="modelValue">
    <template v-for="item in getOptions" :key="item.label">
      <el-radio :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script lang="ts" setup>
  import { computed, useAttrs } from 'vue';
  import { isString } from 'lodash-es';
  import type { PropType } from 'vue';
  import type { RadioGroupProps, RadioProps } from 'element-plus';

  defineOptions({
    name: 'FormRadioGroup',
  });

  const props = defineProps({
    options: {
      type: Array as PropType<RadioProps[]>,
      default: () => [] as RadioProps[],
    },
  });
  const attrs = useAttrs();
  // @ts-nocheck
  const modelValue = defineModel({
    type: String as PropType<RadioGroupProps['modelValue']>,
  });

  const getOptions = computed((): RadioProps[] => {
    const { options } = props;
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as RadioProps[];

    return options.map((item) => ({
      label: item,
      value: item,
    })) as unknown as RadioProps[];
  });
</script>
