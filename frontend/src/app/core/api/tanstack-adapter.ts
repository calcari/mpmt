/* v8 ignore start */
import { injectQuery } from '@tanstack/angular-query-experimental';
import type {
  Client,
  ClientPathsWithMethod,
  MaybeOptionalInit,
  MethodResponse,
} from 'openapi-fetch';

// Utils
const ALLOWED_INIT_KEYS = ['params', 'body', 'headers', 'baseUrl', 'parseAs', 'bodySerializer'] as const;
type AllowedInitKey = (typeof ALLOWED_INIT_KEYS)[number];
type AllowedPart<I> = I extends object ? Pick<I, Extract<keyof I, AllowedInitKey>> : never;
type MediaType = `${string}/${string}`;

function pickAllowed<I>(options: I): AllowedPart<I> {
  const src = (options ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of ALLOWED_INIT_KEYS) if (k in src) out[k] = src[k];
  return out as AllowedPart<I>;
}

function stableStringify(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'function') return `[fn:${(value as Function).name || 'anonymous'}]`;
  if (t !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .filter((k) => obj[k] !== undefined)
    .map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k]))
    .join(',')}}`;
}

// Types
type LCMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';
type UpperMethod = Uppercase<LCMethod>;
type PathsOf<C> = C extends Client<infer P, any> ? P : never;
type EnsureHasMethod<P, M extends string> = P & Record<M, unknown>;

type QueryExtras<TData> = {
  // Basic tanstack options
  enabled?: boolean;
  initialData?: TData;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
};

// Wrapper
export function createOpenapiQuery<Paths extends {}, Media extends MediaType = MediaType>(
  client: Client<Paths, Media>,
) {
  type CreatedClient = typeof client;

  function makeVerb<M extends LCMethod>(method: M) {
    const UC = method.toUpperCase() as UpperMethod;

    return function injectOpenapi<
      Path extends ClientPathsWithMethod<CreatedClient, M>,
      Init extends MaybeOptionalInit<EnsureHasMethod<PathsOf<CreatedClient>[Path], M>, M>,
    >(
      path: Path,
      optionsFactory: () => AllowedPart<Init> & QueryExtras<MethodResponse<CreatedClient, M, Path, Init>>,
    ) {
      return injectQuery(() => {
        const opts = optionsFactory();
        const init = pickAllowed(opts) as any as Init;

        const key = [path as string, stableStringify(init)] as const;

        return {
          queryKey: key,
          enabled: opts.enabled ?? true,
          initialData: opts.initialData as MethodResponse<CreatedClient, M, Path, Init> | undefined,
          refetchOnWindowFocus: opts.refetchOnWindowFocus,
          staleTime: opts.staleTime,
          gcTime: opts.gcTime,
          retry: opts.retry as any,
          queryFn: async () => {
            const call = client[UC].bind(client) as (
              p: Path,
              i: Init,
            ) => Promise<{ data?: MethodResponse<CreatedClient, M, Path, Init>; error?: unknown }>;
            const { data, error } = await call(path, init);
            if (error) throw error;
            return data as MethodResponse<CreatedClient, M, Path, Init>;
          },
        };
      });
    };
  }

  return {
    GET: makeVerb('get'),
    PUT: makeVerb('put'),
    POST: makeVerb('post'),
    DELETE: makeVerb('delete'),
    OPTIONS: makeVerb('options'),
    HEAD: makeVerb('head'),
    PATCH: makeVerb('patch'),
    TRACE: makeVerb('trace'),
  };
}
/* v8 ignore end */