import path from 'path';
import consola from 'consola';
import chalk from 'chalk';
import { dest, parallel, series, src } from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import { phOutput } from '@p-helper/build-utils';
import type { TaskFunction } from 'gulp';

const distFolder = path.resolve(__dirname, 'dist');
const distBundle = path.resolve(phOutput, 'theme-chalk');

function buildThemeChalk() {
  const sass = gulpSass(dartSass);
  const noPPrefixFile = /(index|base|display)/;
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000,
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`,
        );
      }),
    )
    .pipe(
      rename((path) => {
        if (!noPPrefixFile.test(path.basename)) {
          path.basename = `p-${path.basename}`;
        }
      }),
    )
    .pipe(dest(distFolder));
}

export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle));
}

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(dest(path.resolve(distBundle, 'src')));
}

export const build: TaskFunction = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle),
);

export default build;
