import { copyFile, mkdir } from 'fs/promises';
import path from 'path';
import { parallel, series } from 'gulp';
import { copy } from 'fs-extra';
import {
  buildOutput,
  phOutput,
  phPackage,
  projRoot,
} from '@p-helper/build-utils';
import { buildConfig, run, runTask, withTaskName } from './src';
import type { TaskFunction } from 'gulp';
import type { Module } from './src';

export const copyFiles = () =>
  Promise.all([
    copyFile(phPackage, path.join(phOutput, 'package.json')),

    copyFile(
      path.resolve(projRoot, 'global.d.ts'),
      path.resolve(phOutput, 'global.d.ts')
    ),
  ]);
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages');
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    );

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

export const copyFullStyle = async () => {
  await mkdir(path.resolve(phOutput, 'dist'), { recursive: true });
  await copyFile(
    path.resolve(phOutput, 'theme-chalk/index.css'),
    path.resolve(phOutput, 'dist/index.css')
  );
};
export const build: TaskFunction = series(
  // withTaskName('clean', () => run('pnpm run clean')),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle
    )
  ),
  parallel(copyTypesDefinitions, copyFiles)
);
export default build;

export * from './src';
