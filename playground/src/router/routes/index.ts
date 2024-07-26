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
  {
    path: '/test-table-2',
    component: () => import('@/views/table/TestTable2.vue'),
  },
  {
    path: '/test-upload',
    component: () => import('@/views/upload/UploadTest.vue'),
  },
  {
    path: '/test-drawer',
    component: () => import('@/views/drawer/TestDrawer.vue'),
  },
  {
    path: '/test-x6',
    component: () => import('@/views/x6-test/X6Test.vue'),
  },
  {
    path: '/tabs',
    component: () => import('@/views/tabs/Tabs.vue'),
  },
];
