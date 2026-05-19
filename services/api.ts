import logger from '@/utils/logger';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { getToken } from './tokenStore';

export const BASE_URL = 'http://10.123.215.193:9000/api';
const TAG = 'ApiClient';

// ─── Unauthorised handler (registered by authService) ─────────────────────────

type RetryFn = (config: InternalAxiosRequestConfig) => Promise<any>;
type UnauthorizedHandler = (error: any, retry: RetryFn) => Promise<any>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
export const setUnauthorizedHandler = (fn: UnauthorizedHandler) => {
  unauthorizedHandler = fn;
  logger.info(TAG, 'Unauthorized handler registered');
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveErrorMessage = (error: any, isTimeout: boolean): string =>
  isTimeout ? 'Request timed out. Please try again.' : (error.response?.data?.message ?? error.message);

const logError = (status: number | string, url: string, message: string, isTimeout: boolean, isClientError: boolean) => {
  const label = isTimeout ? 'TIMEOUT' : status;
  if (isTimeout || isClientError) {
    logger.warn(TAG, `← ${label} ${url}`, message);
  } else {
    logger.error(TAG, `← ${label} ${url}`, message);
  }
};

// ─── Axios client ─────────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  logger.debug(TAG, `→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    logger.debug(TAG, `← ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status: number | string = error.response?.status ?? 'N/A';
    const url: string = error.config?.url ?? 'unknown';
    const isTimeout = error.code === 'ECONNABORTED';
    const isUnauthorized = status === 401;
    const isClientError = !isTimeout && typeof status === 'number' && status >= 400 && status < 500;
    const message = resolveErrorMessage(error, isTimeout);

    logError(status, url, message, isTimeout, isClientError);

    if (isUnauthorized) {
      if (!unauthorizedHandler) {
        logger.warn(TAG, 'Received 401 but no unauthorized handler is registered — skipping token refresh');
      } else {
        return unauthorizedHandler(error, (config) => apiClient(config));
      }
    }

    return Promise.reject(isTimeout ? new Error(message) : error);
  }
);

// ─── Public API ───────────────────────────────────────────────────────────────

const api = {
  get:  <T>(url: string, params?: object) => apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) => apiClient.post<T>(url, body).then((r) => r.data),
  put:  <T>(url: string, body?: unknown) => apiClient.put<T>(url, body).then((r) => r.data),
  del:  <T>(url: string) => apiClient.delete<T>(url).then((r) => r.data),
};

export default api;
