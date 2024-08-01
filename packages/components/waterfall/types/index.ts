export interface WaterfallOptions {
  pageWidth?: number;
  itemWidth?: number;
  height?: number;
  col?: number; // 列数
  widthAuto?: boolean;
  pageSize?: number;
  page?: number;
}

export interface StyleConfig extends Partial<CSSStyleSheet> {
  width?: string;
}

export interface WaterfallPagination {
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface WaterfallItem<T = Record<string, any>> {
  id: string;
  index: number;
  page: WaterfallPagination['page'];
  item: T;
  ready: boolean;
  style: StyleConfig;
}

export interface DataItemConfig {
  list: WaterfallItem[];
  allReady: boolean;
  run: (page?: number) => Promise<any[]>;
  heights: any[];
}

export interface DataItem {
  [key: string | number]: DataItemConfig;
}
