import { GetEnvelopedFn } from './get-enveloped.cjs';
import { Plugin } from './plugin.cjs';
import { Spread, TuplifyUnion, Unarray } from './utils.cjs';
export interface DefaultContext extends Record<string | symbol | number, unknown> {
}
export declare type ComposeContextArray<V> = V extends [] ? [] : V extends [Plugin<infer Ctx>] ? [Ctx] : V extends [Plugin<infer Ctx>, ...infer R] ? [Ctx, ...ComposeContextArray<R>] : [{
    error: 'ComposeContextArray-no-match';
    value: V;
}];
export declare type ComposeContext<V extends Plugin[]> = Spread<ComposeContextArray<TuplifyUnion<Unarray<V>>>>;
export declare type ContextFrom<TEnvelop> = TEnvelop extends GetEnvelopedFn<infer Context> ? Context : never;
