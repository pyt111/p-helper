import type { BasicPageParams, BasicPageParams2 } from '../mode';
import { defHttp } from '@/utils/http';

export const getRandomPhotos = (params?: BasicPageParams) =>
  defHttp.get(`https://picsum.photos/v2/list`, {
    params,
  });

export const getRandomPhotos2 = (params?: BasicPageParams2) =>
  defHttp.get(`http://jsonplaceholder.typicode.com/photos`, {
    params,
  });
