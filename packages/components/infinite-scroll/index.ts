import InfiniteScroll from './src';

import type { App } from 'vue';
import type { SFCWithInstall } from '@p-helper/utils';

const _InfiniteScroll = InfiniteScroll as SFCWithInstall<typeof InfiniteScroll>;

_InfiniteScroll.install = (app: App) => {
  // 因为使用的是element-plus的指令  所以要检查下是否已经注册过
  if (app._context.directives.InfiniteScroll) return;
  app.directive('InfiniteScroll', _InfiniteScroll);
};

export default _InfiniteScroll;
export const PInfiniteScroll = _InfiniteScroll;
