import { INSTALLED_KEY } from '@p-helper/constants';

import { provideGlobalConfig } from 'element-plus';
import type { App, Plugin } from '@vue/runtime-core';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?) => {
    if (app[INSTALLED_KEY]) return;

    if (options) {
      provideGlobalConfig(options, app, true);
    }
    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));
  };

  return {
    install,
  };
};
