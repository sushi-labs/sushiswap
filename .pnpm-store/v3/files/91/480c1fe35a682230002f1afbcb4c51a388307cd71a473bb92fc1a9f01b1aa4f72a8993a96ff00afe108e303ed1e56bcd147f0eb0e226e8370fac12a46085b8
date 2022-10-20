import { createLruCache } from '@graphql-mesh/utils';
import LocalForage from 'localforage';

function nextTick() {
    // Make sure this is scheduled for next tick because LRU Cache is synchronous
    // This helps for testing multiple Mesh instances pointing to the same cache
    return new Promise(resolve => setTimeout(resolve));
}
function createInMemoryLRUDriver(ttl) {
    let lru;
    return {
        _driver: 'INMEMORY_LRU',
        _initStorage(options) {
            lru = createLruCache(options.size, ttl);
        },
        async getItem(key, callback) {
            try {
                await nextTick();
                const value = lru.get(key);
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async setItem(key, value, callback) {
            try {
                await nextTick();
                lru.set(key, value);
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async removeItem(key, callback) {
            try {
                await nextTick();
                lru.delete(key);
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                callback(err);
                throw err;
            }
        },
        async clear(callback) {
            try {
                await nextTick();
                lru.clear();
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async length(callback) {
            try {
                await nextTick();
                const value = lru.size;
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async key(n, callback) {
            try {
                await nextTick();
                const value = lru.keys()[n];
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async keys(callback) {
            try {
                await nextTick();
                const value = lru.keys();
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async iterate(iteratee, callback) {
            try {
                await nextTick();
                lru.keys().forEach((key, i) => {
                    iteratee(lru.get(key), key, i);
                });
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
    };
}

LocalForage.defineDriver(createInMemoryLRUDriver()).catch(err => console.error('Failed at defining InMemoryLRU driver', err));
class LocalforageCache {
    constructor(config) {
        const driverNames = (config === null || config === void 0 ? void 0 : config.driver) || ['INDEXEDDB', 'WEBSQL', 'LOCALSTORAGE', 'INMEMORY_LRU'];
        this.localforage = LocalForage.createInstance({
            name: (config === null || config === void 0 ? void 0 : config.name) || 'graphql-mesh-cache',
            storeName: (config === null || config === void 0 ? void 0 : config.storeName) || 'graphql-mesh-cache-store',
            driver: driverNames.map(driverName => { var _a; return (_a = LocalForage[driverName]) !== null && _a !== void 0 ? _a : driverName; }),
        });
    }
    async get(key) {
        const expiresAt = await this.localforage.getItem(`${key}.expiresAt`);
        if (expiresAt && Date.now() > expiresAt) {
            await this.localforage.removeItem(key);
        }
        return this.localforage.getItem(key.toString());
    }
    async getKeysByPrefix(prefix) {
        const keys = await this.localforage.keys();
        return keys.filter(key => key.startsWith(prefix));
    }
    async set(key, value, options) {
        const jobs = [this.localforage.setItem(key, value)];
        if (options === null || options === void 0 ? void 0 : options.ttl) {
            jobs.push(this.localforage.setItem(`${key}.expiresAt`, Date.now() + options.ttl * 1000));
        }
        await Promise.all(jobs);
    }
    delete(key) {
        return this.localforage.removeItem(key);
    }
}

export default LocalforageCache;
