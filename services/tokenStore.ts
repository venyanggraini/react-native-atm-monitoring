import { AuthResponse } from "@/types/auth";

type AuthState = Pick<AuthResponse, 'accessToken' | 'refreshToken' | 'publicKey'>;

let authState: AuthState | null = null;

export const saveAuth = (auth: AuthResponse) => {
  authState = {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    publicKey: auth.publicKey,
  };
};

export const getToken = (): string | null => authState?.accessToken ?? null;

export const getRefreshToken = (): string | null => authState?.refreshToken ?? null;

export const updateTokens = (accessToken: string, refreshToken: string) => {
  if (authState) {
    authState.accessToken = accessToken;
    authState.refreshToken = refreshToken;
  }
};

export const clearAuth = () => {
  authState = null;
};
