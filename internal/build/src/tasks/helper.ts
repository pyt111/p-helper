import path from 'path';
import helper from 'components-helper';
import {
  getPackageManifest,
  phOutput,
  phPackage,
  projRoot,
} from '@p-helper/build-utils';

import type { TaskFunction } from 'gulp';
import type {
  ReAttribute,
  ReComponentName,
  ReDocUrl,
  ReWebTypesSource,
} from 'components-helper';

const reComponentName: ReComponentName = (title: string) =>
  `p-${title
    .replace(/\B([A-Z])/g, '-$1')
    .replace(/[ ]+/g, '-')
    .toLowerCase()}`;

const reDocUrl: ReDocUrl = (fileName, header) => {
  const docs = '/';
  const _header = header ? header.replaceAll(/\s+/g, '-').toLowerCase() : '';

  return `${docs}${fileName}.html${_header ? '#' : ''}${_header}`;
};

const reWebTypesSource: ReWebTypesSource = (title) => {
  const symbol = `El${title
    .replaceAll(/-/g, ' ')
    .replaceAll(/^\w|\s+\w/g, (item) => {
      return item.trim().toUpperCase();
    })}`;

  return { symbol };
};

const reAttribute: ReAttribute = (value, key) => {
  const str = value
    .replace(/^\*\*(.*)\*\*$/, (_, item) => item)
    .replace(/^`(.*)`$/, (_, item) => item)
    .replaceAll(/<del>.*<\/del>/g, '');

  if (key === 'Name' && /^(-|—)$/.test(str)) {
    return 'default';
  } else if (str === '' || /^(-|—)$/.test(str)) {
    return undefined;
  } else if (key === 'Attribute' && /v-model:(.+)/.test(str)) {
    const _str = str.match(/v-model:(.+)/);
    return _str ? _str[1] : undefined;
  } else if (key === 'Attribute' && /v-model/.test(str)) {
    return 'model-value';
  } else if (key === 'Attribute') {
    return str
      .replaceAll(/\s*[\\*]\s*/g, '')
      .replaceAll(/\s*<.*>\s*/g, '')
      .replaceAll(/\s*\(.*\)\s*/g, '')
      .replaceAll(/\B([A-Z])/g, '-$1')
      .toLowerCase();
  } else if (key === 'Type') {
    return str
      .replace(/\s*\/\s*/g, '|')
      .replace(/\s*,\s*/g, '|')
      .replace(/\(.*\)/g, '')
      .toLowerCase();
  } else if (key === 'Accepted Values') {
    return /\[.+\]\(.+\)/.test(str) || /^\*$/.test(str)
      ? undefined
      : str.replace(/`/g, '');
  } else if (key === 'Subtags') {
    return str
      ? `p-${str
          .replaceAll(/\s*\/\s*/g, '/p-')
          .replaceAll(/\B([A-Z])/g, '-$1')
          .replaceAll(/\s+/g, '-')
          .toLowerCase()}`
      : undefined;
  } else {
    return str;
  }
};

export const buildHelper: TaskFunction = (done) => {
  const { name, version } = getPackageManifest(phPackage);

  const tagVer = process.env.TAG_VERSION;
  const _version = tagVer
    ? tagVer.startsWith('v')
      ? tagVer.slice(1)
      : tagVer
    : version!;

  helper({
    name: name!,
    version: _version,
    entry: `${path.resolve(projRoot, 'docs/zh-CN/component')}/*.md`,
    outDir: phOutput,
    reComponentName,
    reDocUrl,
    reWebTypesSource,
    reAttribute,
    props: 'Attributes',
    propsName: 'Attribute',
    propsOptions: 'Accepted Values',
    eventsName: 'Event Name',
    tableRegExp:
      // eslint-disable-next-line max-len
      /#+\s+(.*\s*Attributes|.*\s*Events|.*\s*Slots|.*\s*Directives)\s*\n+(\|?.+\|.+)\n\|?\s*:?-+:?\s*\|.+((\n\|?.+\|.+)+)/g,
  });

  done();
};
