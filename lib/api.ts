import 'server-only';

import { getSessionToken } from './session';

const API_URL = process.env.API_URL ?? 'http://127.0.0.1:4000';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  /** Send without the admin session cookie (used by the public form). */
  anonymous?: boolean;
  headers?: Record<string, string>;
};

/**
 * Server-only wrapper around the backend API. The backend listens on an
 * internal port that the browser cannot reach, so every call goes through a
 * Server Component, Server Action or Route Handler.
 */
export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, anonymous = false, headers = {} } = options;

  const token = anonymous ? null : await getSessionToken();

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    // Admin screens must always reflect the current database state.
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message =
      (payload as { message?: string } | null)?.message ??
      'Something went wrong. Please try again.';

    throw new ApiError(response.status, message);
  }

  return payload as T;
}

/** Returns null on 404 instead of throwing, for resources that may not exist yet. */
export async function apiOrNull<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T | null> {
  try {
    return await api<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
