import path from 'path';
import { buildOutput, phOutput } from '@p-helper/build-utils';
import { PKG_NAME } from '@p-helper/build-constants';
import type { ModuleFormat } from 'rollup';

const outDir = path.resolve(buildOutput, 'types');

export const modules = ['esm', 'cjs', 'types'] as const;

export type Module = (typeof modules)[number];

export interface BuildInfo {
  module?: 'ESNext' | 'CommonJS';
  format: ModuleFormat;
  ext: 'mjs' | 'cjs' | 'js' | 'd.ts';
  output: {
    /** e.g: `es` */
    name: string;
    /** e.g: `dist/p-helper/es` */
    path: string;
  };

  bundle: {
    /** e.g: `p-helper/es` */
    path: string;
  };
}

export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(phOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(phOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
};

export const buildConfigEntries = Object.entries(
  buildConfig
) as BuildConfigEntries;

export type BuildConfigEntries = [Module, BuildInfo][];

export const target = 'es2018';
