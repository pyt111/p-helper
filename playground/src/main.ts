import '@/style/index.scss';
import { createApp } from 'vue';
import '@p-helper/theme-chalk/src/index.scss';
import { PInfiniteScroll } from '@p-helper/components';
import App from './App.vue';
import { setupRouter } from '@/router';

const app = createApp(App);

setupRouter(app);

app.use(PInfiniteScroll).mount('#app');
