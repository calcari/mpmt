import { ProjectRole } from '@core/api/types';

function define<const T extends readonly string[]>(...keys: T){
    type U = T[number];
    const base = Object.fromEntries(keys.map((k) => [k, k])) as { readonly [K in U]: K };

    Object.defineProperties(base, {
      keys: { value: keys, enumerable: false },
      values: { value: keys, enumerable: false },
      is: {
        value: (x: unknown): x is U =>
          typeof x === 'string' && (keys as readonly string[]).includes(x as string),
        enumerable: false,
      },
    });

    return Object.freeze(base) as { readonly [K in U]: K } & {
      readonly keys: T;
      readonly values: T;
      is(x: unknown): x is U;
    };
  }

export const stringEnum = {

  define:define,
  materilize<T extends string>() {
  return function <const V extends readonly T[]>(
    ...values: V & Exhaustive<T, V>
  ) {
    return define(...values)
  };
}
} as const;

export namespace stringEnum {
  export type infer<T> = Extract<T[keyof T], string>;
}


type Exhaustive<T, V extends readonly unknown[]> =
  Exclude<T, V[number]> extends never
    ? unknown
    : ["Missing values:", Exclude<T, V[number]>];

