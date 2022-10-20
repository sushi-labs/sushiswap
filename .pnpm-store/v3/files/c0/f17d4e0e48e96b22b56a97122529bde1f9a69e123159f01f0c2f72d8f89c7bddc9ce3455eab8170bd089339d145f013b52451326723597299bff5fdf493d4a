import { KeyValueCache, KeyValueCacheSetOptions, YamlConfig } from '@graphql-mesh/types';
export default class LocalforageCache<V = any> implements KeyValueCache<V> {
    private localforage;
    constructor(config?: YamlConfig.LocalforageConfig);
    get(key: string): Promise<V>;
    getKeysByPrefix(prefix: string): Promise<string[]>;
    set(key: string, value: V, options?: KeyValueCacheSetOptions): Promise<void>;
    delete(key: string): Promise<void>;
}
