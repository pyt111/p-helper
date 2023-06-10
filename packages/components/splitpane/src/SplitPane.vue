<template>
  <div ref="elRef" :class="[]">
    <slot />
  </div>
</template>

<script lang="ts">
  import {
    cloneVNode,
    computed,
    defineComponent,
    h,
    nextTick,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import { useNamespace } from '@p-helper/hooks';
  import { useMouseInElement } from '@vueuse/core';
  import { splitPaneProps } from './SplitPaneProps';
  import type { DragDirection, MoveDirection, PaneItemConfig } from '../types';
  import type { SplitPaneItemPropsTypes } from '@p-helper/components/splitpane/src/SplitPaneItemProps';
  import type { ComponentInternalInstance } from 'vue';

  export default defineComponent({
    name: 'PSplitPane',
    props: splitPaneProps,
    expose: ['slotDefaultChildrenVNodes'],
    setup(props, { slots, expose }) {
      const ns = useNamespace('split-pane');

      const elRef = ref<HTMLElement>();

      const target = ref<{
        target: HTMLElement | null;
        instance: ComponentInternalInstance | null;
      }>({
        target: null,
        instance: null,
      });

      const dragDirection = ref<DragDirection>('');

      // const { x, y } = useMouse();
      const { elementX, elementY } = useMouseInElement(elRef);

      const mousedownPoint = reactive({
        x: 0,
        y: 0,
      });

      const slotDefaultChildrenVNodes =
        (slots.default && slots.default()) || [];

      const paneItems = ref<{ [key: string]: PaneItemConfig }>({});

      // const getCurrentTargetPanelItem = computed(() => {
      //   if (!target.value.instance) return;
      //   const id = target.value.instance.uid;
      //   return paneItems.value[id];
      // });

      // 检查是否是最外侧的两个
      // const checkIsFirstOrLast = (targetId, direction: DragDirection) => {
      //   const nId = direction === 'forward' ? targetId - 1 : targetId + 1;
      //   return paneItems.value[nId];
      // };

      // 获取选中paneItem两侧分割后的面板
      // const getTotalSides = computed(() => {
      //   const paneItem = getCurrentTargetPanelItem.value;
      //   if (!paneItem) return [];
      //   const paneArr = Object.entries(paneItems.value).map(
      //     ([key, item]) => item
      //   );
      //   const targetIndex = paneArr.findIndex(
      //     (item) => item.id === paneItem.id
      //   );
      //   return [
      //     paneArr.slice(0, targetIndex + 1),
      //     paneArr.slice(targetIndex + 1),
      //   ];
      // });

      const isSplitter = computed(() => {
        if (!target.value.target) return;
        return [...target.value.target.classList].includes(
          ns.be('item', 'splitter')
        );
      });

      const pressed = ref(false);
      // const { pressed } = useMousePressed({ target: elRef });

      const isChooseSplitter = computed(
        () => pressed.value && isSplitter.value
      );

      const getSplitterWidth = () => {
        const splitterEl =
          target.value.target ||
          elRef.value?.querySelector(`.${ns.be('item', 'splitter')}`);
        return splitterEl?.offsetWidth || 0;
      };

      const getSplitterFullWidth = () => {
        const childrenLen = slotDefaultChildrenVNodes.length;
        const childrenRatioNum = childrenLen > 1 ? childrenLen - 1 : 0;
        const splitterWidth = getSplitterWidth();
        return splitterWidth * childrenRatioNum;
      };

      const getSizeConfig = (moveX = 0, moveY = 0) => {
        if (!target.value.target || !target.value.instance) return;
        // if (moveX === 0 || moveY === 0) return;

        const splitterFullWidth = getSplitterFullWidth();
        const fullWidth = elRef.value?.clientWidth || 1;
        const fullItemsWidth = fullWidth - splitterFullWidth;
        const baseRatio = (1 / fullItemsWidth) * 100;
        console.log('baseRatio >--->', baseRatio);

        const moveXRatio = moveX * baseRatio;
        const moveYRatio = moveY * baseRatio;
        return {
          moveXRatio,
          moveYRatio,
          baseRatio,
          fullItemsWidth,
        };
      };

      // const checkPaneItemSize = (paneItem: PaneItemConfig) => {
      //   if (typeof paneItem.size === 'string') {
      //     // console.log('paneItem.size >--->', paneItem.size, parseInt(String(paneItem.size)));
      //     paneItem.size = parseInt(String(paneItem.size));
      //   }
      // };
      //
      // const limitPaneItemSize = (paneItem: PaneItemConfig) => {
      //   if (elementX.value <= 0) {
      //     paneItem.size = 0;
      //   }
      //   if (paneItem.size! > 100) {
      //     paneItem.size = 100;
      //   }
      // };

      // const getDirectionFullSize = (direction: DragDirection) => {
      //   const arr =
      //     getTotalSides.value[dragDirection.value === 'forward' ? 0 : 1];
      //   return arr.reduce((res, item) => {
      //     res += item.size as number;
      //     return res;
      //   }, 0);
      // };

      // 检查是否拖动到边界
      const checkCriticality = () => {
        const targetSplitter = target.value.target;
        if (!targetSplitter) return;
        // console.log(
        //   'targetSplitter.offsetLeft >--->',
        //   targetSplitter.offsetLeft,
        //   targetSplitter.clientLeft,
        //   elRef.value?.offsetLeft,
        //   elRef.value?.clientLeft
        // );
        // console.log('x >--->', targetSplitter.offsetLeft, x.value, elementX.value);

        const left = targetSplitter.offsetLeft - targetSplitter.clientLeft;
        return [left === elRef.value?.offsetLeft];
      };

      const updatePaneItemSize = (
        paneItem: PaneItemConfig & { size: number }
      ) => {
        paneItem.update({
          [props.direction === 'horizontal'
            ? 'width'
            : 'height']: `${paneItem.size}%`,
        });
      };

      const balancePreAndNextSize = (paneItem: PaneItemConfig, size) => {
        paneItem.size += size;
        // paneItem.size += parseFloat((size * 100).toFixed(4));
      };

      const handleAdjacentElement = (preItem, nextItem, moveSize) => {
        // limitPaneItemSize(preItem);
        // limitPaneItemSize(nextItem);

        // if (!directionCriticalityFullSize) {
        //   if (dragDirection.value === 'forward') {
        //     // balancePreAndNextSize(nextItem, -moveSize);
        //     // balancePreAndNextSize(nextItem, -moveSize);
        //   } else if (dragDirection.value === 'backward') {
        //     // balancePreAndNextSize(preItem, moveSize);
        //   }
        //   return;
        // } else {
        //
        // }
        balancePreAndNextSize(preItem, moveSize);
        balancePreAndNextSize(nextItem, -moveSize);
        // if (dragDirection.value === 'forward') {
        //   balancePreAndNextSize(preItem, moveSize);
        //   if (directionCriticalityFullSize) {
        //     balancePreAndNextSize(nextItem, -moveSize);
        //   }
        // } else {
        //   balancePreAndNextSize(nextItem, -moveSize);
        //   if (directionCriticalityFullSize) {
        //     balancePreAndNextSize(preItem, moveSize);
        //   }
        // }

        console.log('preItem >--->', preItem.size);
        updatePaneItemSize(preItem);
        updatePaneItemSize(nextItem);
      };

      const getDragDirection = (moveX, moveY): DragDirection => {
        const conditions = props.direction === 'horizontal' ? moveX : moveY;

        if (conditions > 0) {
          return 'backward';
        }

        if (conditions < 0) {
          return 'forward';
        }

        return '';
      };

      // 获取最近一个size不为0的paneItem
      const getPreOrNextPaneItem = (
        targetId,
        direction: DragDirection = 'forward',
        around: 'pre' | 'next'
      ) => {
        const paneItem = paneItems.value[targetId];
        // console.log('paneItem.size >--->', around, paneItem, targetId);
        // if (paneItems.value[nId] && !paneItem.size) {
        //   return getPreOrNextPaneItem(nId);
        // }
        const nId = around === 'pre' ? targetId - 1 : targetId + 1;
        const scanRecursive =
          (direction === 'forward' && around === 'pre') ||
          (direction === 'backward' && around === 'next');

        if (!paneItem.size && paneItems.value[nId] && scanRecursive) {
          return getPreOrNextPaneItem(nId, direction, around);
        }

        return paneItems.value[targetId];
      };

      const calculateSize = (moveDirection: MoveDirection, moveX, moveY) => {
        if (!target.value.target || !target.value.instance) return;

        const sizeConfig = getSizeConfig(moveX, moveY);

        if (!sizeConfig) return;
        const { moveXRatio, moveYRatio } = sizeConfig;

        const targetId = target.value.instance.uid;

        const paneItem = getPreOrNextPaneItem(
          targetId,
          dragDirection.value,
          'pre'
        );
        // if (!paneItem.size && dragDirection === 'forward') return;
        const paneItemNext = getPreOrNextPaneItem(
          targetId + 1,
          dragDirection.value,
          'next'
        );
        // if (!paneItemNext.size && dragDirection === 'backward') return;

        // 检查size的类型 并转换
        // if (!paneItem.size || paneItemNext.size >= 100) return;
        // checkPaneItemSize(paneItem);
        // checkPaneItemSize(paneItemNext);

        const moveSize =
          props.direction === 'horizontal' ? moveXRatio : moveYRatio;
        // if (Number(moveSize) === 0) return;
        handleAdjacentElement(paneItem, paneItemNext, moveSize);
        // console.log('paneItem >--->', paneItem, paneItemNext);
      };

      const updateSize = (event: MouseEvent) => {
        const moveX = event.movementX;
        const moveY = event.movementY;
        let moveDirection: MoveDirection = moveX > 0 ? 'right' : 'left';
        if (props.direction === 'vertical') {
          moveDirection = moveY > 0 ? 'bottom' : 'top';
        }
        calculateSize(moveDirection, moveX, moveY);
      };

      const onmousemove = (event) => {
        // if (isOutside.value) return;

        if (!isChooseSplitter.value) return;

        const moveX = event.movementX;
        const moveY = event.movementY;
        // if (Math.abs(moveX) === 0) return;
        dragDirection.value = getDragDirection(moveX, moveY);

        const [left] = checkCriticality() as any;

        console.log('directionCriticalityFullSize >--->', left);
        if (dragDirection.value === 'forward' && left) {
          return;
        }

        updateSize(event);
      };

      const onMouseUp = () => {
        pressed.value = false;
        unbindEvents();
        dragDirection.value = '';
      };

      const addPane = (paneItemInstance: ComponentInternalInstance) => {
        const itemProxy = paneItemInstance.proxy;
        const exposed = paneItemInstance.exposed;
        if (!itemProxy) return;
        const paneItemProps = itemProxy.$props as SplitPaneItemPropsTypes;
        const min = parseFloat(String(paneItemProps.minSize));
        const max = parseFloat(String(paneItemProps.maxSize));
        paneItems.value[paneItemInstance.uid] = {
          id: paneItemInstance.uid,
          min: isNaN(min) ? 0 : min,
          max: isNaN(max) ? 100 : max,
          size:
            paneItemProps.size !== null
              ? Number(parseFloat(paneItemProps.size.toString()).toFixed(4))
              : null,
          update: exposed?.updateSize,
        };
      };

      const bindEvents = () => {
        document.addEventListener('mousemove', onmousemove, { passive: false });
        document.addEventListener('mouseup', onMouseUp);
      };

      const unbindEvents = () => {
        document.removeEventListener('mousemove', onmousemove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      const init = async () => {
        await nextTick();
        let fullSize = 0;
        const noSizeItems: PaneItemConfig[] = [];

        Object.entries(paneItems.value).forEach(([id, item]) => {
          if (item.size !== null) {
            fullSize += parseInt(String(item.size));
          } else {
            noSizeItems.push(item);
          }
        });

        const averageSize = (100 - fullSize) / noSizeItems.length;
        noSizeItems.forEach((item) => {
          item.size = averageSize;
          item.update({
            [props.direction === 'horizontal'
              ? 'width'
              : 'height']: `${item.size}%`,
          });
        });
      };

      watch(
        () => pressed.value,
        () => {
          if (!pressed.value) {
            unbindEvents();
            target.value = {
              target: null,
              instance: null,
            };
          } else {
            bindEvents();
          }
        }
      );

      onMounted(() => {
        init();
        // console.log('defaultVNode >--->', defaultVNode);
        // slotDefaultChildrenVNodes.value = instance.slots.default();
        // console.log('slotDefaultChildrenVNodes >--->', slotDefaultChildrenVNodes);
      });

      expose({
        addPane,
        paneItems,
      });

      return () => {
        return h(
          'div',
          {
            class: [ns.b(), ns.is(props.direction)],
            ref: elRef,
          },
          [
            slotDefaultChildrenVNodes.map((child, index) => {
              // addPane(child.props as SplitPaneItemPropsTypes);
              return h(
                cloneVNode(child, {
                  splitterShow: index + 1 < slotDefaultChildrenVNodes.length,
                }),
                {
                  splitterAttrs: {},
                  onAddPane: addPane,
                  onMousedown: (event: MouseEvent, paneItemInstance) => {
                    pressed.value = true;
                    const eventTarget = event.target as HTMLElement;
                    target.value = {
                      target: eventTarget,
                      instance: paneItemInstance,
                    };
                    mousedownPoint.x = elementX.value;
                    mousedownPoint.y = elementY.value;
                  },
                }
              );
            }),
          ]
        );
      };
    },
  });
</script>
