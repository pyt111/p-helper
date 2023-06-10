import { computed, h, ref, unref, watch } from 'vue';
import { ElPagination } from 'element-plus';

import { isBoolean } from '@p-helper/utils/is';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';
import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';

export function usePagination(
  refProps: ComputedRef<BasicTableProps>,
  {
    paginationChange,
  }: {
    paginationChange: (configRef: Ref<PaginationProps>) => void;
  }
) {
  const configRef = ref<PaginationProps>({
    currentPage: 1,
    total: 0,
  });
  const show = ref(true);
  const paginationLayout = ref('total, sizes, prev, pager, next, jumper');

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {}),
        };
      }
    }
  );

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps);

    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }

    return {
      pageSize: PAGE_SIZE,
      defaultPageSize: PAGE_SIZE,
      align: 'center',
      // showSizeChanger: true,
      layout: paginationLayout.value,
      // @ts-ignore
      pageSizes: PAGE_SIZE_OPTIONS,
      showTotal: (total) => `共${total}条数据`,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    };
  });

  function renderPagination() {
    const config = (getPaginationInfo.value || {}) as Partial<PaginationProps>;
    return h(ElPagination, {
      style: 'text-align: center;padding: 20px 20px 0',

      ...config,
      'onUpdate:current-page': (value) => {
        configRef.value.currentPage = value;
        paginationChange(configRef);
      },
      'onUpdate:page-size': (pageSize) => {
        configRef.value.pageSize = pageSize;
        paginationChange(configRef);
      },
    });
  }

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo);
    // @ts-ignore
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  }

  function getPagination() {
    return unref(getPaginationInfo);
  }

  function getShowPagination() {
    return unref(show);
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  return {
    getPagination,
    getPaginationInfo,
    setShowPagination,
    getShowPagination,
    setPagination,
    renderPagination,
  };
}
