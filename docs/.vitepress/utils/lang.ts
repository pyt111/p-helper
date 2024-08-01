import path from 'path';
import { docRoot } from '@p-helper/build-utils';

export const ensureLang = (lang: string) => `/${lang}`;

export const languages = ['zh-CN', 'en-US'];

export const getLang = (id: string) =>
  path.relative(docRoot, id).split(path.sep)[0];
