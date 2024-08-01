import { ensureLang } from '../utils/lang';

import componentLocale from '../pages/component.json';

function getComponentsSideBar() {
  return Object.fromEntries(
    Object.entries(componentLocale).map(([lang, val]) => [
      lang,
      Object.values(val).map((item) => mapPrefix(item, lang, '/component')),
    ])
  );
}

// return sidebar with language configs.
// this might create duplicated data but the overhead is ignorable
const getSidebars = (lang) => {
  return {
    [`/${lang}/component/`]: getComponentsSideBar()[lang],
  };
};

type Item = {
  text: string;
  items?: Item[];
  link?: string;
};

function mapPrefix(item: Item, lang: string, prefix = '') {
  if (item.items && item.items.length > 0) {
    return {
      ...item,
      items: item.items.map((child) => mapPrefix(child, lang, prefix)),
    };
  }
  return {
    ...item,
    link: `${ensureLang(lang)}${prefix}${item.link ?? ''}`,
  };
}

export const sidebars = getSidebars('zh-CN');
