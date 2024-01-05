import { readPackageJSON } from 'pkg-types';
import { type UserConfig, defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';

import { commonConfig } from './common';
import type { ModuleFormat } from 'rollup';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {
    //
  };
}

function definePackageConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;
  const root = process.cwd();
  return defineConfig(async ({ mode }) => {
    console.log('root >--->', root);
    const { dependencies = {}, peerDependencies = {} } = await readPackageJSON(
      root
    );
    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: './index.ts',
          formats: ['es'],
          fileName: (format: ModuleFormat, entryName: string) => {
            console.log(' format>--->', format);
            console.log(' entryName>--->', entryName);
            return 'index.mjs';
          },
        },
        rollupOptions: {
          external: [
            '@p-helper/components',
            ...Object.keys(dependencies),
            ...Object.keys(peerDependencies),
          ],
        },
      },
      plugins: [
        vue(),
        vueJsx(),
        // dts({
        //   logLevel: 'error',
        // }),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig(mode), packageConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfig };
