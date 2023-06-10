import type { WaterfallItem, WaterfallPagination } from '../types';
import type { ExtractPropTypes, PropType } from 'vue';

type WAlign = 'left' | 'right' | 'center';

type WShadow = 'always' | 'hover' | 'never';

export const waterfallProps = {
  loadApi: {
    type: Function as PropType<
      (arg?: WaterfallPagination) => Promise<any[]> | any[]
    >,
    default: null,
  },
  mode: {
    type: String,
    default: 'js' as 'css' | 'js',
  },
  autoHeight: {
    type: Boolean,
    default: false,
  },
  alignMode: {
    type: String as PropType<WAlign>,
    default: 'left' as WAlign,
  },
  shadow: {
    type: String as PropType<WShadow>,
    default: 'always',
  },
  /**
   * 每次更新位置执行方法的时间间隔 ms
   */
  updateIntervalTime: {
    type: Number,
    default: 50,
  },
  /**
   * 元素展示过渡 [间隔] 时间 ms
   */
  transitionIntervalTime: {
    type: Number,
    default: 50,
  },
  /**
   * 元素展示【过渡动画】时间 ms
   */
  transitionDuration: {
    type: Number,
    default: 500,
  },
  /**
   * 元素展示是否递进过渡 根据当前元素所在下标计算 index * transitionIntervalTime
   */
  transitionProgressive: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    default: () => [] as WaterfallItem[],
  },
  itemWidth: {
    type: [Number, String],
  },
  gap: {
    type: Number,
    default: 5,
  },
  col: {
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  immediateLoad: {
    type: Boolean,
    default: true,
  },
  scrollDelay: {
    type: Number,
    default: 500,
  },
};
export type WaterfallProps = ExtractPropTypes<typeof waterfallProps>;
