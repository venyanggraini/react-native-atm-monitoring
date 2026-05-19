import { AuthRequest, AuthResponse } from '@/types/auth';
import logger from '@/utils/logger';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import forge from 'node-forge';
import api, { BASE_URL, setUnauthorizedHandler } from './api';
import { clearAuth, getRefreshToken, saveAuth, updateTokens } from './tokenStore';

const AUTH_URL = `${BASE_URL}/v1/auth`;
const TAG = 'AuthService';

// ─── Token refresh queue ──────────────────────────────────────────────────────

type QueueEntry = { resolve: (token: string) => void; reject: (error: unknown) => void };
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const flushQueue = (error: unknown, token?: string) => {
  logger.debug(TAG, `Flushing ${failedQueue.length} queued request(s) — ${error ? 'with error' : 'with new token'}`);
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token!));
  failedQueue = [];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const forceLogout = () => {
  logger.warn(TAG, 'Forcing logout — clearing auth and redirecting to login');
  clearAuth();
  router.replace({ pathname: '/', params: { sessionExpired: '1' } });
};

const encryptWithPublicKey = (text: string, publicKeyPem: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(text), 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha1.create() },
  });
  return forge.util.encode64(encrypted);
};

// ─── Auth features ────────────────────────────────────────────────────────────

export const initAuth = async (): Promise<AuthResponse> => {
  logger.info(TAG, 'Fetching public key');
  const data = await api.get<AuthResponse>(`${AUTH_URL}/init`);
  logger.info(TAG, 'Public key received');
  return data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  logger.info(TAG, `Login attempt for user: ${username}`);
  const { publicKey } = await initAuth();

  logger.debug(TAG, 'Encrypting password');
  const body: AuthRequest = { username, password: encryptWithPublicKey(password, publicKey) };
  const data = await api.post<AuthResponse>(`${AUTH_URL}/login`, body);
  saveAuth(data);
  logger.info(TAG, `Login successful for user: ${username}`);
  return data;
};

export const refreshToken = async (): Promise<string> => {
  logger.info(TAG, 'Refreshing token');
  const { data } = await axios.post<AuthResponse>(`${AUTH_URL}/refresh`, null, {
    headers: { Authorization: `Bearer ${getRefreshToken()}` },
  });
  updateTokens(data.accessToken, data.refreshToken);
  logger.info(TAG, 'Token refreshed successfully');
  return data.accessToken;
};

export const logout = async (): Promise<void> => {
  logger.info(TAG, 'Logout requested');
  const data = await api.post<AuthResponse>(`${AUTH_URL}/logout`);
  if (data.message === 'Logged out successfully') {
    clearAuth();
    logger.info(TAG, 'Logout successful, auth state cleared');
  } else {
    logger.warn(TAG, 'Logout response unexpected', data.message);
  }
};

// ─── 401 handler (registered into api.ts) ────────────────────────────────────

const handleUnauthorized = async (
  error: any,
  retry: (config: InternalAxiosRequestConfig) => Promise<any>
): Promise<any> => {
  const originalRequest: RetryableRequest = error.config;
  logger.info(TAG, `Handling 401 for ${originalRequest?.url} — _retry: ${!!originalRequest._retry}, isRefreshing: ${isRefreshing}`);

  if (originalRequest._retry) {
    logger.warn(TAG, 'Refresh token also expired — forcing logout');
    flushQueue(error);
    forceLogout();
    return Promise.reject(error);
  }

  if (isRefreshing) {
    logger.debug(TAG, 'Refresh already in progress — queuing request');
    return new Promise<string>((resolve, reject) => failedQueue.push({ resolve, reject }))
      .then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return retry(originalRequest);
      });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newToken = await refreshToken();
    flushQueue(null, newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    logger.info(TAG, `Retrying original request: ${originalRequest?.url}`);
    return retry(originalRequest);
  } catch (refreshError) {
    logger.warn(TAG, 'Token refresh failed', refreshError);
    flushQueue(refreshError);
    forceLogout();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};

setUnauthorizedHandler(handleUnauthorized);
