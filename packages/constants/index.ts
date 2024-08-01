import { merge } from 'lodash-es';
import settings from './settings/componentSetting';

export * from './key';

export const setSetting = (config: DeepPartial<typeof settings>) => {
  return merge(settings, config);
};
