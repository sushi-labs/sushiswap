import { ImportFn } from '@graphql-mesh/types';
export declare class ReadonlyStoreError extends Error {
}
export declare class ValidationError extends Error {
}
export declare type StoreStorageAdapter<TData = any, TKey = string> = {
    read: (key: TKey, options: ProxyOptions<TData>) => Promise<TData>;
    write: (key: TKey, data: TData, options: ProxyOptions<TData>) => Promise<TData>;
    delete: (key: TKey) => Promise<void>;
};
export declare class InMemoryStoreStorageAdapter implements StoreStorageAdapter {
    private data;
    read<TData>(key: string, options: ProxyOptions<any>): Promise<TData>;
    write<TData>(key: string, data: TData, options: ProxyOptions<any>): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): void;
}
export interface FsStoreStorageAdapterOptions {
    cwd: string;
    importFn: ImportFn;
    fileType: 'ts' | 'json' | 'js';
}
export declare class FsStoreStorageAdapter implements StoreStorageAdapter {
    private options;
    constructor(options: FsStoreStorageAdapterOptions);
    private getAbsolutePath;
    read<TData, TJSONData = any>(key: string, options: ProxyOptions<TData, TJSONData>): Promise<TData>;
    write<TData, TJSONData = any>(key: string, data: TData, options: ProxyOptions<TData, TJSONData>): Promise<void>;
    delete(key: string): Promise<void>;
}
export declare type StoreProxy<TData> = {
    set(value: TData): Promise<void>;
    get(): Promise<TData>;
    getWithSet(setterFn: () => TData | Promise<TData>): Promise<TData>;
    delete(): Promise<void>;
};
export declare type ProxyOptions<TData, TJSONData = any> = {
    codify: (value: TData, identifier: string) => string | Promise<string>;
    fromJSON: (jsonData: TJSONData, identifier: string) => TData | Promise<TData>;
    toJSON: (value: TData, identifier: string) => TJSONData | Promise<TJSONData>;
    validate: (oldValue: TData, newValue: TData, identifier: string) => void | Promise<void>;
};
export declare type StoreFlags = {
    readonly: boolean;
    validate: boolean;
};
export declare enum PredefinedProxyOptionsName {
    JsonWithoutValidation = "JsonWithoutValidation",
    StringWithoutValidation = "StringWithoutValidation",
    GraphQLSchemaWithDiffing = "GraphQLSchemaWithDiffing"
}
export declare const PredefinedProxyOptions: Record<PredefinedProxyOptionsName, ProxyOptions<any>>;
export declare class MeshStore {
    identifier: string;
    protected storage: StoreStorageAdapter;
    flags: StoreFlags;
    constructor(identifier: string, storage: StoreStorageAdapter, flags: StoreFlags);
    child(childIdentifier: string, flags?: Partial<StoreFlags>): MeshStore;
    proxy<TData>(id: string, options: ProxyOptions<TData>): StoreProxy<TData>;
}
