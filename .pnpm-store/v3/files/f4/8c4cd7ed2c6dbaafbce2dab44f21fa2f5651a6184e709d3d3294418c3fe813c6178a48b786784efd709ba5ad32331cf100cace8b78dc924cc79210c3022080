export declare type OptionalPropertyNames<T> = {
    [K in keyof T]-?: {} extends {
        [P in K]: T[K];
    } ? K : never;
}[keyof T];
export declare type SpreadProperties<L, R, K extends keyof L & keyof R> = {
    [P in K]: L[P] | Exclude<R[P], undefined>;
};
export declare type Id<T> = T extends infer U ? {
    [K in keyof U]: U[K];
} : never;
export declare type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>>;
export declare type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : {};
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
export declare type Push<T extends any[], V> = [...T, V];
export declare type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
export declare type Unarray<T> = T extends Array<infer U> ? U : T;
export declare type ArbitraryObject = Record<string | number | symbol, any>;
export declare type PromiseOrValue<T> = T | Promise<T>;
export declare type AsyncIterableIteratorOrValue<T> = T | AsyncIterableIterator<T>;
export declare type Maybe<T> = T | null | undefined;
