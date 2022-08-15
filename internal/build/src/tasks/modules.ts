import { rollup } from 'rollup'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glob from 'fast-glob';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { pkgRoot, phRoot, excludeFiles } from '@p-helper/build-utils'
import { target, buildConfigEntries } from '../build-info'
import { generateExternal, writeBundles } from '../utils'
import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
    const input = excludeFiles(
        await glob('**/*.{js,ts,vue}', {
            cwd: pkgRoot,
            absolute: true,
            onlyFiles: true,
        })
    )

    const bundle = await rollup({
        input,
        plugins: [
            vue({
                isProduction: false
            }),
            vueJsx(),
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
    })
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
            }
        })
    )
}