import { REPO_BRANCH, REPO_PATH } from '@p-helper/build-constants';
import { docsDirName } from '@p-helper/build-utils';
import { sidebars } from './config/sidebars';
import { nav } from './config/nav';
import { languages } from './utils/lang';
import { head } from './config/head';
import { mdPlugin } from './config/plugins';
import type { UserConfig } from 'vitepress';

const locales = {};
languages.forEach((lang) => {
  locales[`/${lang}`] = {
    label: lang,
    lang,
  };
});

const config: UserConfig = {
  title: 'P Helper',
  description: 'a Vue 3 component and tool',
  head,
  themeConfig: {
    repo: REPO_PATH,
    docsBranch: REPO_BRANCH,
    docsDir: docsDirName,

    sidebar: sidebars,
    nav: nav['zh-CN'],
    langs: languages,
  },
  locales,
  markdown: {
    config: (md) => mdPlugin(md),
  },
};

export default config;
