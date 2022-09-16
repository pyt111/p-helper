import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { projRoot } from '@p-helper/build-utils';

import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import UnoCSS from 'unocss/vite';

import type { Alias } from 'vite';

const alias: Alias[] = [
  {
    find: '~/',
    replacement: `${resolve(__dirname, './.vitepress/vitepress')}/`,
  },
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: true,
      https: !!env.HTTPS,
      fs: {
        allow: [projRoot],
      },
    },
    resolve: {
      alias,
    },
    plugins: [
      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: ['.vitepress/vitepress/components'],

        allowOverrides: true,

        // custom resolvers
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
      // https://github.com/antfu/unplugin-icons
      Icons({
        autoInstall: true,
      }),
      UnoCSS(),
    ],
  };
});
