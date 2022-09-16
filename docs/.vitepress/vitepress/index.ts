import 'normalize.css';
// import 'element-plus/dist/index.css'

// for dev
// reset
import '../../../packages/theme-chalk/src/reset.scss';
import '../../../packages/theme-chalk/src/index.scss';
import VPApp from './components/vp-app.vue';
import VPDemo from './components/vp-demo.vue';
import 'uno.css';

import type { Component } from 'vue';

export default VPApp;
export const globals: [string, Component][] = [['Demo', VPDemo]];
