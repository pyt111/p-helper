import { parallel, series } from 'gulp';
import { runTask, withTaskName, buildConfig, run } from "./src";
import {copyFile} from "fs/promises";
import { copy } from 'fs-extra'
import path from "path";
import type { TaskFunction } from 'gulp'
import type { Module } from './src'

import {
    buildOutput,
    phOutput,
    phPackage,
    projRoot,
} from '@p-helper/build-utils'

export const copyFiles = () =>
    Promise.all([
        copyFile(phPackage, path.join(phOutput, 'package.json')),

        copyFile(
            path.resolve(projRoot, 'global.d.ts'),
            path.resolve(phOutput, 'global.d.ts')
        ),
    ])
export const copyTypesDefinitions: TaskFunction = (done) => {
    const src = path.resolve(buildOutput, 'types', 'packages')
    const copyTypes = (module: Module) =>
        withTaskName(`copyTypes:${module}`, () =>
            copy(src, buildConfig[module].output.path, { recursive: true })
        )

    return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}
export default series(
    withTaskName('clean', () => run('pnpm run clean')),

    parallel(
        runTask('buildModules'),
        runTask('buildFullBundle'),
        runTask('generateTypesDefinitions'),
    ),
    parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'