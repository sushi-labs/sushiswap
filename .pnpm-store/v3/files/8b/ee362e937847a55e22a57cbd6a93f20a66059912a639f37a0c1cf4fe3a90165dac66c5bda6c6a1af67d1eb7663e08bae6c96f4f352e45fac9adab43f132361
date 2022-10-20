"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBatchingExecutor = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const utils_1 = require("@graphql-tools/utils");
const mergeRequests_js_1 = require("./mergeRequests.js");
const splitResult_js_1 = require("./splitResult.js");
function createBatchingExecutor(executor, dataLoaderOptions, extensionsReducer = defaultExtensionsReducer) {
    const loadFn = createLoadFn(executor, extensionsReducer);
    const loader = new dataloader_1.default(loadFn, dataLoaderOptions);
    return function batchingExecutor(request) {
        const operationAst = (0, utils_1.getOperationASTFromRequest)(request);
        return operationAst.operation === 'subscription' ? executor(request) : loader.load(request);
    };
}
exports.createBatchingExecutor = createBatchingExecutor;
function createLoadFn(executor, extensionsReducer) {
    return async function batchExecuteLoadFn(requests) {
        const execBatches = [];
        let index = 0;
        const request = requests[index];
        let currentBatch = [request];
        execBatches.push(currentBatch);
        const operationAst = (0, utils_1.getOperationASTFromRequest)(request);
        const operationType = operationAst.operation;
        if (operationType == null) {
            throw new Error('could not identify operation type of document');
        }
        while (++index < requests.length) {
            const currentRequest = requests[index];
            const currentOperationAST = (0, utils_1.getOperationASTFromRequest)(currentRequest);
            const currentOperationType = currentOperationAST.operation;
            if (operationType === currentOperationType) {
                currentBatch.push(currentRequest);
            }
            else {
                currentBatch = [currentRequest];
                execBatches.push(currentBatch);
            }
        }
        const results = await Promise.all(execBatches.map(async (execBatch) => {
            const mergedRequests = (0, mergeRequests_js_1.mergeRequests)(execBatch, extensionsReducer);
            const resultBatches = (await executor(mergedRequests));
            return (0, splitResult_js_1.splitResult)(resultBatches, execBatch.length);
        }));
        return results.flat();
    };
}
function defaultExtensionsReducer(mergedExtensions, request) {
    const newExtensions = request.extensions;
    if (newExtensions != null) {
        Object.assign(mergedExtensions, newExtensions);
    }
    return mergedExtensions;
}
