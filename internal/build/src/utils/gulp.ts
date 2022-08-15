import type { TaskFunction } from 'gulp';
import { buildRoot } from '@p-helper/build-utils'
import { run } from './process';

export const withTaskName = <T = TaskFunction>(name: string, fn: T) =>
    Object.assign(fn, { displayName: name });

export const runTask = (name: string) =>
    withTaskName(`shellTask:${name}`, () =>
        run(`pnpm run start ${name}`, buildRoot)
    )

