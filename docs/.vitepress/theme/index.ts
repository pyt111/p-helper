import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import DefaultTheme from 'vitepress/theme';

import { define } from '../utils/types';
import './style.css';
import type { Theme } from 'vitepress';
import { globals } from '~/index';

export default define<Theme>({
  ...DefaultTheme,
  // Layout() {
  //   return h(DefaultTheme.Layout as any, null, {
  //     'doc-before': () => h(App),
  //   });
  // },
  enhanceApp: ({ app }) => {
    app.use(ElementPlus as any);
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp as any);
    });
  },
});
