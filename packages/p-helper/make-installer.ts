import { INSTALLED_KEY } from '@p-helper/constants';

import { provideGlobalConfig, useGlobalConfig } from 'element-plus';
import type { App, Plugin } from '@vue/runtime-core';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?) => {
    if (app[INSTALLED_KEY]) return;
    const globalConfig = useGlobalConfig();

    if (globalConfig) {
      provideGlobalConfig(options, app, true);
    }
    if (options) {
      // @ts-ignore
      provideGlobalConfig(options, app, true);
    }
    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));
  };

  return {
    install,
  };
};
