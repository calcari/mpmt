import createClient from 'openapi-fetch';
import { environment } from '../../../environments/environment';

import { paths } from './schema';
import { createOpenapiQuery } from './tanstack-adapter';

const getApiUrl = () => {
  if (window.location.hostname === 'localhost') {
    return environment.apiURL; //localhost:8080 (dev) ou localhost:8066 (prod)
  }else{
    return `${window.location.protocol}//${window.location.hostname}`; //https://mpmt.calcari.dev
  }
};

export const apiClient = createClient<paths>({
  baseUrl: getApiUrl(),
  credentials: 'include',
});
export const injectOpenapiQuery = createOpenapiQuery<paths>(apiClient);