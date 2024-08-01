import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
// import { IduxResolver } from 'unplugin-vue-components/resolvers'
import DefineOptions from 'unplugin-vue-define-options/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// @ts-ignore
export default defineConfig(() => {
  return {
    base: '/',
    root: process.cwd(),
    resolve: {
      alias: {
        '@': pathResolve('src'),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      DefineOptions(),
      createSvgIconsPlugin({
        symbolId: 'icon-[dir]-[name]',
        iconDirs: [pathResolve('src/assets/icons')],
        svgoOptions: {
          full: true,
          plugins: [
            'preset-default',
            'removeTitle',
            {
              type: 'full',
              name: 'add-data-original-fill',
              fn: (ast) => {
                const paths = ast.querySelectorAll('path');
                paths.forEach((path) => {
                  const fillValue = path.attributes.fill;
                  if (fillValue) {
                    path.attributes['data-original-fill'] = fillValue;
                  }
                });
                return ast;
              },
            },
          ],
        },
      }),
      Components({
        include: `${__dirname}/**`,
        dirs: ['../packages/components'],
        // dts: 'src/components.d.ts',
        dts: false,
      }),
    ],
    server: {
      host: true, // 开发时打开 Network
      port: 5174,
      // origin: 'http://127.0.0.1', // 解决资源访问
    },
  };
});
