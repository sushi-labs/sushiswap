import { Plugin } from '@envelop/core';
import { DocumentNode } from 'graphql';
interface Cache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T): void;
}
export declare type DocumentCache = Cache<DocumentNode>;
export declare type ErrorCache = Cache<Error>;
export declare type ParserCacheOptions = {
    documentCache?: DocumentCache;
    errorCache?: ErrorCache;
};
export declare const useParserCache: (pluginOptions?: ParserCacheOptions) => Plugin;
export {};
