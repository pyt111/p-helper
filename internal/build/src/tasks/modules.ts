import path from 'path';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import vue from '@vitejs/plugin-vue';
import DefineOptions from 'unplugin-vue-define-options/rollup';
import vueJsx from '@vitejs/plugin-vue-jsx';
import glob from 'fast-glob';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import {
  buildOutput,
  excludeFiles,
  phRoot,
  pkgRoot,
} from '@p-helper/build-utils';
import postcss from 'rollup-plugin-postcss';
import { buildConfigEntries, target } from '../build-info';
import { generateExternal, writeBundles } from '../utils';
import type { OutputOptions, Plugin } from 'rollup';
const outDir = path.resolve(buildOutput, 'types');

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  );

  const bundle = await rollup({
    input,
    plugins: [
      DefineOptions(),
      vue({
        isProduction: true,
      }) as Plugin,
      vueJsx() as Plugin,
      // 使用postcss处理scss样式
      postcss({
        // 抽出.vue文件中的style 到单独的文件
        extract: true,
        // 自动导入抽出的css文件
        inject: {
          insertAt: 'top',
        },
        // 完整配置
        modules: true,
        // extensions: ['.css', '.scss', '.sass'],
        use: ['sass'],
      }),

      // postcss({
      //   // 将css 抽出到单独的文件
      //   extract: true,
      //   // 自动导入抽出的css文件
      //   inject: {
      //     insertAt: 'top',
      //   },
      // }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
      }),
      commonjs(),
      terser({
        compress: {
          drop_console: true,
        },
      }),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
        exclude: ['node_modules'],
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  });
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: phRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      };
    })
  );
};
