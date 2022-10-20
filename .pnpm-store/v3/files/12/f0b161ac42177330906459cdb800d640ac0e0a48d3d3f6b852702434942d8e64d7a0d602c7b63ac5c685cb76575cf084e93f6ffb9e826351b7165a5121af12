import { getLoader } from './getLoader.js';
export function batchDelegateToSchema(options) {
    const key = options.key;
    if (key == null) {
        return null;
    }
    else if (Array.isArray(key) && !key.length) {
        return [];
    }
    const loader = getLoader(options);
    return Array.isArray(key) ? loader.loadMany(key) : loader.load(key);
}
