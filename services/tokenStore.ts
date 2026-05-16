import { AuthResponse } from "@/types/auth";

type AuthState = Pick<AuthResponse, 'token' | 'refreshToken' | 'publicKey'>;

let authState: AuthState | null = null;

export const saveAuth = (auth: AuthResponse) => {
  authState = { token: auth.token, refreshToken: auth.refreshToken, publicKey: auth.publicKey };
};

export const getToken = (): string | null => authState?.token ?? null;

export const clearAuth = () => {
  authState = null;
};