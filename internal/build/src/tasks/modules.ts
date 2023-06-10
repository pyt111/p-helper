import path from 'path';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
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
        isProduction: false,
      }) as Plugin,
      vueJsx() as Plugin,
      postcss(),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
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
