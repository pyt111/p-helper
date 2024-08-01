<template>
  <div
    ref="paneItem"
    v-bind="$attrs.rootAttrs"
    :class="ns.b('item')"
    :style="itemStyle"
  >
    <slot />
  </div>
  <div
    v-if="splitterShow"
    ref="splitter"
    v-bind="$attrs.splitterAttrs"
    :class="[ns.be('item', 'splitter'), mousedown ? ns.is('mousedown') : '']"
    @mousedown.prevent="onmousedown"
  />
</template>

<script lang="ts" setup>
  import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { splitPaneItemProps } from './SplitPaneItemProps';

  defineOptions({
    name: 'PSplitPaneItem',
  });
  const emit = defineEmits(['addPane', 'mousedown']);
  const props = defineProps(splitPaneItemProps);
  const paneItem = ref();
  const splitter = ref();

  const instance = getCurrentInstance();
  const show = ref(true);
  const mouseState = reactive({
    mousedown: false,
  });

  // PSplitPaneItem
  const ns = useNamespace('split-pane');

  const itemStyle = ref({
    width: `${props.size}%`,
  });

  const updateSize = (style) => {
    // Object.assign(itemStyle.value, style)
    // console.log('style >--->', style);
    itemStyle.value = style;
  };

  const onmousedown = (event) => {
    emit('mousedown', event, instance);
  };
  onMounted(() => {
    // console.log('instance >--->', instance);
    emit('addPane', instance);
  });

  const { mousedown } = toRefs(mouseState);
  const { splitterShow } = toRefs(props);

  defineExpose({
    show,
    updateSize,
    paneItem,
    splitter,
  });
</script>

<style scoped></style>
