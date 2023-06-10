import type { RouteRecordRaw } from 'vue-router';

export const playRoutes: Partial<RouteRecordRaw>[] = [
  {
    path: '/waterfall',
    component: () => import('@/views/waterfall/index.vue'),
  },
  {
    path: '/split-pane',
    component: () => import('@/views/split-pane/index.vue'),
  },
  {
    path: '/test-table',
    component: () => import('@/views/table/TestTable.vue'),
  },
];
