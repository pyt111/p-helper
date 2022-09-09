import type { RouteRecordRaw } from 'vue-router';

export const playRoutes: Partial<RouteRecordRaw>[] = [
  {
    path: '/waterfall',
    component: () => import('@/views/waterfall/index.vue'),
  },
];
