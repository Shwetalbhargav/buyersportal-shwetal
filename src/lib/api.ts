// src/lib/api.ts
import { buildQuery, type QueryParams } from './url';
import type { Buyer } from '@/lib/types';


/** Allowed HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Options for the api() helper */
export interface ApiOptions {
  method?: HttpMethod;
  query?: QueryParams;
  /** Request body will be JSON.stringified if provided */
  body?: unknown;
  /** Extra headers to send */
  headers?: Record<string, string>;
  /** Base URL for relative `path` (falls back to NEXT_PUBLIC_API_BASE or current origin) */
  baseUrl?: string;
  /** Optional AbortSignal (cancellation / timeouts) */
  signal?: AbortSignal;
  /** When true, includes credentials (cookies) for same-origin APIs */
  credentials?: 'omit' | 'same-origin' | 'include';
}

/** Rich error thrown when the response is not ok */
export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: string;
  constructor(message: string, status: number, url: string, body: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

/**
 * Small JSON/content-type aware fetch wrapper.
 * - Throws ApiError on non-2xx.
 * - Parses JSON when Content-Type includes "application/json".
 * - For 204/205 (no content), returns `undefined` cast to T (documented).
 */
export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const base =
    opts.baseUrl ??
    (typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_API_BASE ?? ''
      : process.env.NEXT_PUBLIC_API_BASE ?? window.location.origin);

  const url = new URL(path, base || 'http://localhost');
  if (opts.query) url.search = buildQuery(opts.query);

  const headers: Record<string, string> = {
    'Accept': 'application/json, text/plain;q=0.8, */*;q=0.5',
    ...(opts.headers ?? {}),
  };

  const hasBody = typeof opts.body !== 'undefined' && opts.body !== null;
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    headers,
    body: hasBody ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    signal: opts.signal,
    credentials: opts.credentials ?? 'same-origin',
  };

  if (hasBody && headers['Content-Type'] === undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url.toString(), init);

  // Fast path for no-content statuses
  if (res.status === 204 || res.status === 205) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return undefined as unknown as T;
  }

  const contentType = res.headers.get('Content-Type') ?? '';
  const isJson = contentType.toLowerCase().includes('application/json');
  const payloadText = isJson ? undefined : await res.text().catch(() => '');

  if (!res.ok) {
    // Try to extract error text safely
    let body = '';
    try {
      body = payloadText ?? JSON.stringify(await res.json());
    } catch {
      body = payloadText ?? '';
    }
    throw new ApiError(
      `API ${init.method} ${url.pathname} -> ${res.status}`,
      res.status,
      url.toString(),
      body,
    );
  }

  if (isJson) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return (await res.json()) as T;
  }

  // If server returned non-JSON content (e.g., CSV/text), cast to T so callers can opt-in.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (payloadText ?? '') as unknown as T;
}

/**
 * Convenience helpers when you want explicit return shapes.
 * These are thin wrappers over api<T>() for readability.
 */
export const getJSON = <T>(path: string, opts?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(path, { ...(opts ?? {}), method: 'GET' });

export const postJSON = <T>(path: string, body?: unknown, opts?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(path, { ...(opts ?? {}), method: 'POST', body });

export const putJSON = <T>(path: string, body?: unknown, opts?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(path, { ...(opts ?? {}), method: 'PUT', body });

export const patchJSON = <T>(path: string, body?: unknown, opts?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(path, { ...(opts ?? {}), method: 'PATCH', body });

export const deleteJSON = <T>(path: string, opts?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(path, { ...(opts ?? {}), method: 'DELETE' });

export const getBuyer = (id: string) =>
  getJSON<Buyer>(`/buyers/api/buyers/${encodeURIComponent(id)}`);

export const createBuyer = (body: Partial<Buyer>) =>
  postJSON<Buyer>(`/buyers/api/buyers`, body);

export const updateBuyer = (id: string, body: Partial<Buyer>) =>
  patchJSON<Buyer>(`/buyers/api/buyers/${encodeURIComponent(id)}`, body);
