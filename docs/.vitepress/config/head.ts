import fs from 'fs';
import path from 'path';
import { vpRoot } from '@p-helper/build-utils';
import { languages } from '../utils/lang';

import type { HeadConfig } from 'vitepress';

export const head: HeadConfig[] = [
  [
    'script',
    {},
    `;(() => {
      window.supportedLangs = ${JSON.stringify(languages)}
    })()`,
  ],
  ['script', {}, fs.readFileSync(path.resolve(vpRoot, 'lang.js'), 'utf-8')],
];
