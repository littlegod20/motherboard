import { env } from '../config/env';
import { useAuthStore } from '../stores/authStore';
import { ApiError } from './errors';
import type { ApiErrorBody, AuthTokens } from './types';

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken, setTokens, clearSession } = useAuthStore.getState();
  if (!refreshToken) {
    clearSession();
    return false;
  }

  try {
    const res = await fetch(`${env.apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = (await parseBody(res)) as AuthTokens | ApiErrorBody;
    if (!res.ok) {
      clearSession();
      return false;
    }
    const tokens = data as AuthTokens;
    await setTokens(tokens.accessToken, tokens.refreshToken, tokens.user);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = true, skipRefresh = false } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, { code: 'NETWORK', message: 'Network request failed' });
  }

  if (res.status === 401 && auth && !skipRefresh) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const ok = await refreshPromise;
    if (ok) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
  }

  const data = await parseBody(res);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data as ApiErrorBody) || { message: res.statusText },
    );
  }
  return data as T;
}
