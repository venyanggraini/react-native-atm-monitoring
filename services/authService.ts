import { AuthRequest, AuthResponse } from '@/types/auth';
import logger from '@/utils/logger';
import forge from 'node-forge';
import api from './api';
import { clearAuth, saveAuth } from './tokenStore';

const AUTH_URL = `/v1/auth`;
const TAG = 'AuthService';

const encryptWithPublicKey = (text: string, publicKeyPem: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(text), 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha1.create() },
  });
  return forge.util.encode64(encrypted);
};

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
  const encryptedPassword = encryptWithPublicKey(password, publicKey);

  const body: AuthRequest = { username, password: encryptedPassword };
  const data = await api.post<AuthResponse>(`${AUTH_URL}/login`, body);

  saveAuth(data);
  logger.info(TAG, `Login successful for user: ${username}`);
  return data;
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