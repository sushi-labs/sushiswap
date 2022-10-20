import { Plugin } from '@envelop/types';
export declare type ContextFactoryFn<TResult = unknown, TCurrent = unknown> = (currentContext: TCurrent) => TResult | Promise<TResult>;
declare type UnwrapAsync<T> = T extends Promise<infer U> ? U : T;
export declare const useExtendContext: <TContextFactory extends (...args: any[]) => any>(contextFactory: TContextFactory) => Plugin<UnwrapAsync<ReturnType<TContextFactory>>>;
export {};
