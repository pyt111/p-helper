import axios from 'axios';
import { merge } from 'lodash-es';
import type { AxiosRequestConfig } from 'axios';

function createAxios(opt?: Partial<AxiosRequestConfig>) {
  const options = merge(
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
    opt || {}
  );
  return axios.create(options);
}

export const defHttp = createAxios();
