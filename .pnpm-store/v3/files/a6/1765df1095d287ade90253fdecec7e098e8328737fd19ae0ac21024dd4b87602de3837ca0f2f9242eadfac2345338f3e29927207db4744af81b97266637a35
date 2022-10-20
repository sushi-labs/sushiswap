import { getNamedType, GraphQLList } from 'graphql';
import DataLoader from 'dataloader';
import { delegateToSchema } from '@graphql-tools/delegate';
import { memoize3, relocatedError } from '@graphql-tools/utils';
function createBatchFn(options) {
    var _a, _b;
    const argsFromKeys = (_a = options.argsFromKeys) !== null && _a !== void 0 ? _a : ((keys) => ({ ids: keys }));
    const fieldName = (_b = options.fieldName) !== null && _b !== void 0 ? _b : options.info.fieldName;
    const { valuesFromResults, lazyOptionsFn } = options;
    return async function batchFn(keys) {
        const results = await delegateToSchema({
            returnType: new GraphQLList(getNamedType(options.info.returnType)),
            onLocatedError: originalError => {
                if (originalError.path == null) {
                    return originalError;
                }
                const [pathFieldName, pathNumber] = originalError.path;
                if (pathFieldName !== fieldName) {
                    return originalError;
                }
                const pathNumberType = typeof pathNumber;
                if (pathNumberType !== 'number') {
                    return originalError;
                }
                return relocatedError(originalError, originalError.path.slice(0, 0).concat(originalError.path.slice(2)));
            },
            args: argsFromKeys(keys),
            ...(lazyOptionsFn == null ? options : lazyOptionsFn(options)),
        });
        if (results instanceof Error) {
            return keys.map(() => results);
        }
        const values = valuesFromResults == null ? results : valuesFromResults(results, keys);
        return Array.isArray(values) ? values : keys.map(() => values);
    };
}
function defaultCacheKeyFn(key) {
    if (typeof key === 'object') {
        return JSON.stringify(key);
    }
    return key;
}
const getLoadersMap = memoize3(function getLoadersMap(_context, _fieldNodes, _schema) {
    return new Map();
});
const GLOBAL_CONTEXT = {};
export function getLoader(options) {
    const { schema, fieldName, context, info, dataLoaderOptions } = options;
    const targetFieldName = fieldName !== null && fieldName !== void 0 ? fieldName : info.fieldName;
    const loaders = getLoadersMap(context !== null && context !== void 0 ? context : GLOBAL_CONTEXT, info.fieldNodes, schema);
    let loader = loaders.get(targetFieldName);
    if (loader === undefined) {
        const batchFn = createBatchFn(options);
        loader = new DataLoader(batchFn, {
            // Prevents the keys to be passed with the same structure
            cacheKeyFn: defaultCacheKeyFn,
            ...dataLoaderOptions,
        });
        loaders.set(targetFieldName, loader);
    }
    return loader;
}
