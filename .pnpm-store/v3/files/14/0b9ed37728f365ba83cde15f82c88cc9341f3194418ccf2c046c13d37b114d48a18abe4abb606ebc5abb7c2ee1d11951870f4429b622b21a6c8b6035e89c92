"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBatchDelegateFn = void 0;
const getLoader_js_1 = require("./getLoader.js");
function createBatchDelegateFn(optionsOrArgsFromKeys, lazyOptionsFn, dataLoaderOptions, valuesFromResults) {
    return typeof optionsOrArgsFromKeys === 'function'
        ? createBatchDelegateFnImpl({
            argsFromKeys: optionsOrArgsFromKeys,
            lazyOptionsFn,
            dataLoaderOptions,
            valuesFromResults,
        })
        : createBatchDelegateFnImpl(optionsOrArgsFromKeys);
}
exports.createBatchDelegateFn = createBatchDelegateFn;
function createBatchDelegateFnImpl(options) {
    return batchDelegateOptions => {
        const loader = (0, getLoader_js_1.getLoader)({
            ...options,
            ...batchDelegateOptions,
        });
        return loader.load(batchDelegateOptions.key);
    };
}
