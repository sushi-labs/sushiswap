import { getLoader } from './getLoader.js';
export function createBatchDelegateFn(optionsOrArgsFromKeys, lazyOptionsFn, dataLoaderOptions, valuesFromResults) {
    return typeof optionsOrArgsFromKeys === 'function'
        ? createBatchDelegateFnImpl({
            argsFromKeys: optionsOrArgsFromKeys,
            lazyOptionsFn,
            dataLoaderOptions,
            valuesFromResults,
        })
        : createBatchDelegateFnImpl(optionsOrArgsFromKeys);
}
function createBatchDelegateFnImpl(options) {
    return batchDelegateOptions => {
        const loader = getLoader({
            ...options,
            ...batchDelegateOptions,
        });
        return loader.load(batchDelegateOptions.key);
    };
}
