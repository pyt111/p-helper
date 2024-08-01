import { createRouter, createWebHashHistory } from 'vue-router';
import { playRoutes } from './routes';
import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

export const router = createRouter({
  history: createWebHashHistory('/'),
  routes: playRoutes as unknown as RouteRecordRaw[],
});

// config router
export function setupRouter(app: App<Element>) {
  app.use(router);
}
