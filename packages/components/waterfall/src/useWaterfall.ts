import { computed, nextTick, ref, unref, watch } from 'vue';
import { isPromise } from '@vue/shared';
import { isRef } from 'vue-demi';
import { TasksQueue } from '@p-helper/utils';
import { cloneDeep, debounce, noop } from 'lodash-es';
import { useResizeObserver } from '@vueuse/core';
import type {
  DataItem,
  WaterfallItem,
  WaterfallOptions,
  WaterfallPagination,
} from '../types';
import type { WaterfallProps } from './waterfall';
import type { ComputedRef } from 'vue-demi';
import type { Ref } from 'vue';

export function useWaterfall(
  el: Ref | HTMLAreaElement,
  options: ComputedRef<WaterfallOptions & WaterfallProps>
) {
  if (!el) throw Error('没有el');
  const elementEl = isRef(el) ? el : ref(el);

  /**
   * @page 根据已有数据分页，不是根据请求次数分页
   */
  const createPagination = (): WaterfallPagination => ({
    page: 0,
    pageSize: 10,
    totalPage: 0,
  });

  const pagination = ref(createPagination());
  const waterfalls = ref<DataItem>({});
  const tasks = ref(new TasksQueue());
  const {
    itemWidth: width,
    col: colNum,
    pageSize: _pageSize,
    page: _page,
    modelValue,
    mode,
    autoHeight,
    alignMode,
    updateIntervalTime,
    // transitionIntervalTime,
    // transitionProgressive,
  } = options.value;

  const col = ref(colNum || 0);

  if (!col.value && !width) {
    // eslint-disable-next-line no-console
    console.warn('width || col 必须传一个 ');
    throw '';
  }

  const updateCol = debounce(() => {
    if (width) {
      col.value = Math.floor(elementEl.value.clientWidth / width);
      debounceUpdateWaterfall();
    }
  }, updateIntervalTime);

  const getEmptyPx = () => {
    if (width) {
      return elementEl.value.clientWidth % width;
    }
    return 0;
  };

  const getHeightList = computed(() =>
    Array.from({ length: col.value }, () => 0)
  );

  const cfg = useResizeObserver(elementEl, () => {
    if (width) {
      updateCol();
    } else {
      debounceUpdateWaterfall();
    }
  });
  const stop = cfg.stop;

  /**
   * 初始化
   */
  const init = () => {
    pagination.value = createPagination();
    if (_pageSize) {
      unref(pagination).page = _page;
    }

    if (_pageSize) {
      unref(pagination).pageSize = _pageSize;
    }

    tasks.value.clear();
  };

  init();

  /**
   * 获取当前分页配置项
   * @param page
   * @return DataItemConfig
   */
  const getCurrentPageData = (page) => {
    return unref(waterfalls)[page];
  };

  /**
   * 更新分页配置
   */
  const updatePagination = () => {
    if (waterfalls.value[unref(pagination).page + 1]) {
      unref(pagination).page += 1;
    }
  };

  /**
   * 生产同步任务  用来进入队列中执行
   * @param page
   * @return 任务方法
   */
  const syncTask = (page) => {
    return () => {
      const currentPageData = getCurrentPageData(page);
      if (currentPageData && !currentPageData.allReady) {
        return nextTick(async () => {
          const pl = await currentPageData.run();

          return Promise.all(pl).then(() => {
            const innerColumnHeights = getInnerColumnHeights(page);
            const { heights } = setPosition(page, innerColumnHeights);
            const currentPageData = getCurrentPageData(page);
            currentPageData.allReady = true;
            waterfalls.value[page].heights = heights;
            updatePagination();
          });
        });
      }
    };
  };

  /**
   * 运行队列中的任务
   */
  const runTasks = async () => {
    if (tasks.value.items[0]) {
      const p = tasks.value.items[0]();
      if (isPromise(p)) {
        await p;
        // 执行完后 弹出队列
        tasks.value.dequeue();
        runTasks();
      }
      return p;
    }
  };

  /**
   * 将数据按照pageSize分割
   */
  const createWaterfalls = () => {
    const initPage = unref(pagination).totalPage;
    const start = initPage * unref(pagination).pageSize;
    const end = start + unref(pagination).pageSize;
    const newData: any[] = modelValue.slice(start, end);
    if (newData.length) {
      add(cloneDeep(newData));
      if (mode === 'js') {
        tasks.value.enqueue(syncTask(pagination.value.totalPage));
        // 为了异步数据插入后能正确执行任务
        if (tasks.value.size()) {
          runTasks().then(noop);
        }
      }
    }
  };

  watch(
    () => modelValue,
    () => {
      createWaterfalls();
    },
    {
      deep: true,
    }
  );

  const getItemElement = (page): HTMLCollectionOf<Element> => {
    const pageEl: Element[] =
      unref(elementEl).getElementsByClassName('page-box');

    return pageEl[page - 1].getElementsByClassName('p-waterfall-item');
  };

  const calculateLeftOffsetByAlignMode = (left) => {
    if (alignMode === 'center') {
      return getEmptyPx() / 2 + left;
    }
    if (alignMode === 'right') {
      return getEmptyPx() + left;
    }
    return left;
  };

  /**
   * 设置元素位置
   * @param page
   * @param innerColumnHeights 当前分页配置项 每一列的高度
   */
  const setPosition = (page, innerColumnHeights) => {
    const itemEl = getItemElement(page);
    const heights = [...innerColumnHeights];

    getCurrentPageData(page).list?.forEach(({ item, style }, index) => {
      const { config = {} } = item;
      const { width: w, fullHeight: h } = config;
      const domRect = itemEl[index]?.getBoundingClientRect();
      if (domRect) {
        const itemHeight = h ?? domRect.height;
        const itemWidth = w ?? width;
        const minHeight = Math.min(...heights);
        const minIdx = heights.findIndex((mh) => mh === minHeight) || 0;

        const top = minHeight;
        const left = calculateLeftOffsetByAlignMode(
          minIdx * (itemWidth || domRect.width)
        );

        // transform 为了避免重排 就不使用定位了
        Object.assign(style, {
          width: typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth,
          height: h ? `${itemHeight}px` : '',
          transform: `translate(${left}px, ${top}px)`,
        });
        heights[minIdx] += itemHeight;
      }
    });
    return {
      heights,
    };
  };

  /**
   * 预加载图片
   * @param imgEl
   * @return 图片加载完成后执行的异步任务
   */
  const loadImage = (imgEl) => {
    return new Promise((resolve) => {
      if (imgEl.height) {
        resolve(true);
      } else {
        imgEl.onload = () => {
          resolve(true);
        };
      }
    });
  };

  const getInnerColumnHeights = (page) =>
    waterfalls.value[page - 1 || 1]?.heights || getHeightList.value;

  /**
   * 元素过渡时间
   * @param idx
   */
  // const setTransition = async (idx = 0) => {
  //   return sleep(
  //     transitionProgressive
  //       ? idx * transitionIntervalTime
  //       : transitionIntervalTime
  //   );
  // };

  /**
   * 计算每一列高度
   * @param page
   * @return 异步任务，为了让同步更新每一页的高度，保证每一个元素位置正确
   */
  const computeHeight = (page) => {
    const pl: Promise<any>[] = [];
    const currentPageData = getCurrentPageData(page);
    const itemEl = getItemElement(page);

    currentPageData.list?.forEach((item, idx) => {
      const imps = itemEl[idx].getElementsByTagName('img');
      if (!autoHeight) {
        if (!item.item.config?.fullHeight) {
          const imgHeight = item.item.config?.height || 0;
          [...imps].forEach((imgEl) => {
            imgEl.style.height = `${imgHeight}px`;
          });

          item.ready = true;
          // setTransition(2).then(() => (item.ready = true));
        }
        pl.push(Promise.resolve());
      } else {
        [...imps].forEach((imgEl) => {
          const pr = loadImage(imgEl).then(() => {
            imgEl.onload = null;
            item.ready = true;
            return {
              item,
              imgEl,
            };
          });
          pl.push(pr);
        });
      }
    });
    return pl;
  };

  const pageCompute = (page) => {
    return async () => {
      return computeHeight(page);
    };
  };

  /**
   * 将数据列表转换成分页 初始化每一页的配置
   * @param data
   */
  const add = (data: Record<string, any>[]) => {
    pagination.value.totalPage += 1;
    const totalPage = unref(pagination).totalPage;
    const list: WaterfallItem[] = data.map((item, i) => ({
      id: `item_${totalPage}_${i}`,
      page: totalPage,
      index: (totalPage - 1) * pagination.value.pageSize + i,
      item,
      ready: false,
      style: {},
    }));
    if (mode === 'css') {
      //
    } else {
      unref(waterfalls)[totalPage] = {
        run: pageCompute(totalPage),
        heights: getHeightList.value,
        allReady: false,
        list: [],
      };
      waterfalls.value[totalPage].list = list;
    }
  };

  /**
   * 窗口变化 更新元素位置
   * 只需要将任务重新进入队列 并执行就可以
   */
  const resizeToUpdate = () => {
    tasks.value.clear();
    for (let i = 0; i < pagination.value.totalPage; i += 1) {
      const page = i + 1;
      const currentPageData = getCurrentPageData(page);

      currentPageData.allReady = false;
      currentPageData.heights = getHeightList.value;
      tasks.value.enqueue(syncTask(page));
    }

    runTasks().then(noop);
  };

  const debounceUpdateWaterfall = debounce(resizeToUpdate, updateIntervalTime);

  return {
    add,
    waterfalls,
    pagination,
    resizeToUpdate,
    stopOb: stop,
    debounceUpdateWaterfall,
    tasks,
  };
}
