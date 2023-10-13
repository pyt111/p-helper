import 'virtual:svg-icons-register';
import '@/style/index.scss';
import { createApp } from 'vue';
import '@p-helper/theme-chalk/src/index.scss';

import 'element-plus/dist/index.css';
import { PInfiniteScroll } from '@p-helper/components';
import ElementPlus from 'element-plus';
import { setSetting } from '@p-helper/constants';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import { setupRouter } from '@/router';

setSetting({
  table: {
    column: {
      align: 'center',
    },
  },
});

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
setupRouter(app);

app.use(ElementPlus).use(PInfiniteScroll).mount('#app');
