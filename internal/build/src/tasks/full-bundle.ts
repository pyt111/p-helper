import { parallel } from 'gulp';
import { withTaskName } from '@p-helper/build';
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import { target } from '../build-info'
import path from "path";
import { phOutput, phRoot } from '@p-helper/build-utils'
import type { Plugin } from 'rollup'
import { writeBundles, formatBundleFilename,generateExternal } from '../utils';


async function buildFullEntry(minify: boolean) {
    const plugins: Plugin[] = [
        vue({
            isProduction: true,
        }) as Plugin,
        vueJsx() as Plugin,
        commonjs(),
        esbuild({
            exclude: [],
            sourceMap: minify,
            target,
            loaders: {
                '.vue': 'ts',
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify('production'),
            },
            treeShaking: true,
            legalComments: 'eof',
        })
    ]
    const bundle = await rollup({
        input: path.resolve(phRoot, 'index.ts'),
        plugins,
        external: await generateExternal({ full: true }),
        treeshake: true,
    })
    if (minify) {
        plugins.push(
            minifyPlugin({
                target,
                sourceMap: true,
            })
        )
    }
    await writeBundles(bundle, [
        {
            format: 'umd',
            file: path.resolve(
                phOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'js')
            ),
            exports: 'named',
            name: 'PHelper',
            globals: {
                vue: 'Vue',
            },
            sourcemap: minify,
            // banner,
        },
        {
            format: 'esm',
            file: path.resolve(
                phOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'mjs')
            ),
            sourcemap: minify,
            // banner,
        },
    ])
}

export const buildFull = (minify: boolean) => async () =>
    Promise.all([buildFullEntry(minify)])

export const buildFullBundle = parallel(
    withTaskName('buildFull', buildFull(false))
)