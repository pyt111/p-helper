import type { PaginationProps as ElPaginationProps } from 'element-plus';

export declare class PaginationConfig {
  position?: 'top' | 'bottom' | 'both';
}

export interface PaginationProps extends Partial<ElPaginationProps> {
  /**
   * default initial page number
   * @default 1
   * @type number
   */
  defaultCurrent?: number;

  currentPage?: number;

  /**
   * number of data items per page
   * @type number
   */
  pageSize?: number;

  /**
   * Whether to hide pager on single page
   * @default false
   * @type boolean
   */
  hideOnSinglePage?: boolean;

  /**
   * determine whether pageSize can be changed
   * @default false
   * @type boolean
   */
  showSizeChanger?: boolean;

  /**
   * determine whether you can jump to pages directly
   * @default false
   * @type boolean
   */
  showQuickJumper?: boolean | object;

  /**
   * to display the total number and range
   * @type Function
   */
  showTotal?: (total: number, range: [number, number]) => any;

  /**
   * 位置
   */
  align?: 'left' | 'center' | 'right';
}
