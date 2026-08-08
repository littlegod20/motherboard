import { apiRequest } from './client';
import type { AuthTokens } from './types';

export function register(email: string, password: string) {
  return apiRequest<AuthTokens>('/auth/register', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function login(email: string, password: string) {
  return apiRequest<AuthTokens>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function logout(refreshToken: string) {
  return apiRequest<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  });
}
