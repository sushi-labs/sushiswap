"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoader = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const delegate_1 = require("@graphql-tools/delegate");
const utils_1 = require("@graphql-tools/utils");
function createBatchFn(options) {
    var _a, _b;
    const argsFromKeys = (_a = options.argsFromKeys) !== null && _a !== void 0 ? _a : ((keys) => ({ ids: keys }));
    const fieldName = (_b = options.fieldName) !== null && _b !== void 0 ? _b : options.info.fieldName;
    const { valuesFromResults, lazyOptionsFn } = options;
    return async function batchFn(keys) {
        const results = await (0, delegate_1.delegateToSchema)({
            returnType: new graphql_1.GraphQLList((0, graphql_1.getNamedType)(options.info.returnType)),
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
                return (0, utils_1.relocatedError)(originalError, originalError.path.slice(0, 0).concat(originalError.path.slice(2)));
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
const getLoadersMap = (0, utils_1.memoize3)(function getLoadersMap(_context, _fieldNodes, _schema) {
    return new Map();
});
const GLOBAL_CONTEXT = {};
function getLoader(options) {
    const { schema, fieldName, context, info, dataLoaderOptions } = options;
    const targetFieldName = fieldName !== null && fieldName !== void 0 ? fieldName : info.fieldName;
    const loaders = getLoadersMap(context !== null && context !== void 0 ? context : GLOBAL_CONTEXT, info.fieldNodes, schema);
    let loader = loaders.get(targetFieldName);
    if (loader === undefined) {
        const batchFn = createBatchFn(options);
        loader = new dataloader_1.default(batchFn, {
            // Prevents the keys to be passed with the same structure
            cacheKeyFn: defaultCacheKeyFn,
            ...dataLoaderOptions,
        });
        loaders.set(targetFieldName, loader);
    }
    return loader;
}
exports.getLoader = getLoader;
