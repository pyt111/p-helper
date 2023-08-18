import { computed, nextTick, ref, unref, watch } from 'vue';
import { isBoolean } from '@p-helper/utils/is';
import { useWindowSizeFn } from '@p-helper/hooks/event/useWindowSizeFn';
import { useModalContext } from '@p-helper/components/Modal';
import { onMountedOrActivated } from '@p-helper/hooks/core/onMountedOrActivated';
import { useDebounceFn } from '@vueuse/core';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  getDataSourceRef: ComputedRef<Recordable[]>,
  _wrapRef: Ref<HTMLElement | null>,
  formRef: Ref<ComponentRef>,
  paginationElRef: Ref<ComponentRef | null>
) {
  const tableHeightRef: Ref<Nullable<number | string>> = ref(167);
  const modalFn = useModalContext();
  let parentElement = null as HTMLElement | null;

  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), unref(getDataSourceRef)?.length],
    () => {
      debounceRedoHeight();
    },
    {
      flush: 'post',
    }
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(height: number | string) {
    tableHeightRef.value = height;
    //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
    modalFn?.redoModalHeight?.();
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;

  async function calcTableHeight() {
    const { resizeHeightOffset, pagination, maxHeight } = unref(propsRef);
    const tableData = unref(getDataSourceRef);

    if (!unref(getCanResize) || tableData.length === 0) return;

    await nextTick();

    const paddingHeight = 32;
    let paginationHeight = 2;
    if (!isBoolean(pagination)) {
      paginationEl = unref(paginationElRef)?.$el as HTMLElement;
      if (paginationEl) {
        const offsetHeight = paginationEl?.offsetHeight ?? 0;
        paginationHeight += offsetHeight || 0;
      } else {
        // TODO First fix 24
        paginationHeight += 24;
      }
    } else {
      paginationHeight = -8;
    }

    // let bottomIncludeBody = 0;
    // if (unref(wrapRef) && isCanResizeParent) {
    //   const tablePadding = 12;
    const formMargin = 16;

    let formHeight = unref(formRef)?.$el.offsetHeight ?? 0;
    if (!formHeight && parentElement) {
      // 早期的form
      const formBounding = parentElement
        ?.querySelector('.yee-query-form')
        ?.getBoundingClientRect();
      formHeight = formBounding?.height ?? 0;
    }
    if (formHeight) {
      formHeight += formMargin;
    }

    const boundingHeight = parentElement?.clientHeight ?? 0;

    const otherHeight =
      (resizeHeightOffset || 0) + paddingHeight + paginationHeight + formHeight;
    let height = boundingHeight - otherHeight;
    height =
      (height > (maxHeight as number) ? (maxHeight as number) : height) ??
      height;
    setTimeout(() => {
      setHeight(height);
    }, 100);
  }
  // @ts-ignore
  useWindowSizeFn(() => {
    calcTableHeight();
  }, 300);
  onMountedOrActivated(() => {
    calcTableHeight();
    const { parentContainerClassName } = unref(propsRef);
    nextTick(() => {
      parentElement = document.documentElement.querySelector(
        `.${parentContainerClassName || 'yee-app-main'}`
      );
      debounceRedoHeight();
    });
  });

  // const getScrollX = computed(() => {
  //   let width = 0;
  //
  //   // TODO props ?? 0;
  //   const NORMAL_WIDTH = 150;
  //
  //   const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
  //   columns.forEach((item) => {
  //     width += Number.parseInt(item.width as string) || 0;
  //   });
  //   const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'));
  //
  //   const len = unsetWidthColumns.length;
  //   if (len !== 0) {
  //     width += len * NORMAL_WIDTH;
  //   }
  //
  //   const table = unref(tableElRef);
  //   const tableWidth = table?.$el?.offsetWidth ?? 0;
  //   return tableWidth > width ? '100%' : width;
  // });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);

    return {
      tableHeight,
    };
  });

  return { getScrollRef, redoHeight };
}
