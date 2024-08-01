import { resolve } from 'path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projRoot, 'packages');
export const buildRoot = resolve(projRoot, 'internal', 'build');
export const phRoot = resolve(pkgRoot, 'p-helper');

// Docs
export const docsDirName = 'docs';
export const docRoot = resolve(projRoot, docsDirName);
export const vpRoot = resolve(docRoot, '.vitepress');

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist');
/** `/dist/p-helper` */
export const phOutput = resolve(buildOutput, 'p-helper');

export const phPackage = resolve(phRoot, 'package.json');
