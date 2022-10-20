import { KeyValueCache, YamlConfig, ImportFn, MeshPubSub, Logger, MeshFetch } from '@graphql-mesh/types';
import { Source } from '@graphql-tools/utils';
import { MeshStore } from '@graphql-mesh/store';
declare type ResolvedPackage<T> = {
    moduleName: string;
    resolved: T;
};
interface GetPackageOptions {
    name: string;
    type: string;
    importFn: ImportFn;
    cwd: string;
    additionalPrefixes?: string[];
}
export declare function getPackage<T>({ name, type, importFn, cwd, additionalPrefixes, }: GetPackageOptions): Promise<ResolvedPackage<T>>;
export declare function resolveAdditionalTypeDefs(baseDir: string, additionalTypeDefs: string): Promise<import("graphql").DocumentNode[]>;
export declare function resolveCustomFetch({ fetchConfig, importFn, cwd, cache, additionalPackagePrefixes, }: {
    fetchConfig?: string;
    importFn: ImportFn;
    cwd: string;
    additionalPackagePrefixes: string[];
    cache: KeyValueCache;
}): Promise<{
    fetchFn: MeshFetch;
    importCode: string;
    code: string;
}>;
export declare function resolveCache(cacheConfig: YamlConfig.Config['cache'], importFn: ImportFn, rootStore: MeshStore, cwd: string, pubsub: MeshPubSub, logger: Logger, additionalPackagePrefixes: string[]): Promise<{
    cache: KeyValueCache;
    importCode: string;
    code: string;
}>;
export declare function resolvePubSub(pubsubYamlConfig: YamlConfig.Config['pubsub'], importFn: ImportFn, cwd: string, additionalPackagePrefixes: string[]): Promise<{
    importCode: string;
    code: string;
    pubsub: MeshPubSub;
}>;
export declare function resolveDocuments(documentsConfig: YamlConfig.Config['documents'], cwd: string): Promise<Source[]>;
export declare function resolveLogger(loggerConfig: YamlConfig.Config['logger'], importFn: ImportFn, cwd: string, additionalPackagePrefixes: string[], initialLoggerPrefix?: string): Promise<{
    importCode: string;
    code: string;
    logger: Logger;
}>;
export {};
