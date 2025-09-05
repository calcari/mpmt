import { stringEnum } from '@shared/utils/string-enum';

export const ApiErrorCodes = stringEnum.define(
  'MISSING_RIGHTS',
  'DUPLICATE_EMAIL',
  'DUPLICATE_USERNAME',
  'INVITEE_ALREADY_MEMBER',
  'INVITEE_NOT_FOUND',
  'INVITEE_ALREADY_MEMBER',
  'ASSIGNEE_NOT_MEMBER',
  'ASSIGNEE_ALREADY_ASSIGNED'
);
export type ApiErrorCode = stringEnum.infer<typeof ApiErrorCodes>;

type AnyApiError = { code: ApiErrorCode; [K: string]: any };

export function isApiError(error: unknown): error is AnyApiError {
  return typeof (error as any)?.['code'] === 'string';
}

/* ----------------- ApiError ----------------- */
export class ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  headers?: Headers | Record<string, string> | null;
  url?: string;
  method?: string;
  path?: string;

  constructor(message: string, init?: Partial<ApiError>) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
    Object.assign(this, init);
  }

  static from(
    err: unknown,
    ctx?: { path?: string; method?: string; url?: string; headers?: any }
  ): ApiError {
    if (err instanceof ApiError) {
      return new ApiError(err.message, { ...err, ...ctx });
    }
    if (err instanceof Error) {
      return new ApiError(err.message, { ...err, ...ctx });
    }

    let message = 'Request failed';
    let status: number | undefined;
    let statusText: string | undefined;
    let data: unknown = err;

    if (typeof err === 'string') {
      message = err;
    } else if (err && typeof err === 'object') {
      const any = err as any;
      message = any.message || any.error || any.title || message;
      if (typeof any.status === 'number') status = any.status;
      if (typeof any.statusText === 'string') statusText = any.statusText;
      if ('error' in any && any.error !== undefined) data = any.error;
      else if ('data' in any) data = any.data;
      else if ('body' in any) data = any.body;
    }

    return new ApiError(message, {
      status,
      statusText,
      data,
      ...ctx,
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status ?? null,
      statusText: this.statusText ?? null,
      method: this.method ?? null,
      url: this.url ?? null,
      path: this.path ?? null,
      headers: this.headers ?? null,
      data: safeJsonable(this.data),
      stack: this.stack ?? null,
    };
  }
}

function safeJsonable(value: unknown): unknown {
  if (value instanceof ArrayBuffer) {
    const bytes = new Uint8Array(value);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return { type: 'ArrayBuffer', base64: btoa(bin) };
  }
  if (ArrayBuffer.isView(value)) {
    return { type: (value as any).constructor.name, length: (value as any).length };
  }
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return value.toString();

  const seen = new WeakSet<object>();
  const replacer = (_k: string, v: any) => {
    if (typeof v === 'object' && v !== null) {
      if (seen.has(v)) return '[Circular]';
      seen.add(v);
    }
    return v;
  };
  try {
    JSON.stringify(value, replacer);
    return value;
  } catch {
    return String(value);
  }
}
