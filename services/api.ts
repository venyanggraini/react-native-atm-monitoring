import logger from '@/utils/logger';
import axios from 'axios';
import { router } from 'expo-router';
import { clearAuth, getToken } from './tokenStore';

const BASE_URL = 'http://10.123.215.193:9000/api';

const TAG = 'ApiClient';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const isTimeout = error.code === 'ECONNABORTED';
    const isUnauthorized = status === 401;
    const isClientError = !isTimeout && !isUnauthorized && status >= 400 && status < 500;
    const message = isTimeout
      ? 'Request timed out. Please try again.'
      : (error.response?.data?.message ?? error.message);
    if (isUnauthorized) {
      logger.warn(TAG, `← ${status} ${url}`, message);
      clearAuth();
      router.replace({ pathname: '/', params: { sessionExpired: '1' } });
    } else if (isTimeout || isClientError) {
      logger.warn(TAG, `← ${isTimeout ? 'TIMEOUT' : status} ${url}`, message);
    } else {
      logger.error(TAG, `← ${status} ${url}`, message);
    }
    return Promise.reject(isTimeout ? new Error(message) : error);
  }
);

const api = {
  get:  <T>(url: string, params?: object) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) =>
    apiClient.post<T>(url, body).then((r) => r.data),
  put:  <T>(url: string, body?: unknown) =>
    apiClient.put<T>(url, body).then((r) => r.data),
  del:  <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),
};

export default api;
