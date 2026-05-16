import axios from 'axios';
import logger from '@/utils/logger';
import { getToken } from './tokenStore';

export const BASE_URL = 'http://192.168.1.109:9000/api';

const TAG = 'ApiClient';

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  logger.debug(TAG, `→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    logger.debug(TAG, `← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status ?? 'N/A';
    const url = error.config?.url ?? 'unknown';
    const message = error.response?.data?.message ?? error.message;
    logger.error(TAG, `← ${status} ${url}`, message);
    return Promise.reject(error);
  }
);

export default apiClient;