import '@/style/index.scss';
import { createApp } from 'vue';
import '@p-helper/theme-chalk/src/index.scss';

import 'element-plus/dist/index.css';
import { PInfiniteScroll } from '@p-helper/components';
import ElementPlus from 'element-plus';
import App from './App.vue';
import { setupRouter } from '@/router';

const app = createApp(App);

setupRouter(app);

app.use(ElementPlus).use(PInfiniteScroll).mount('#app');
