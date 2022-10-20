import { handleStreamOrSingleExecutionResult } from '../utils.js';
const makeHandleResult = (errorHandler) => ({ result, args }) => {
    var _a;
    if ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) {
        errorHandler(result.errors, args);
    }
};
export const useErrorHandler = (errorHandler) => {
    const handleResult = makeHandleResult(errorHandler);
    return {
        onExecute() {
            return {
                onExecuteDone(payload) {
                    return handleStreamOrSingleExecutionResult(payload, handleResult);
                },
            };
        },
        onSubscribe() {
            return {
                onSubscribeResult(payload) {
                    return handleStreamOrSingleExecutionResult(payload, handleResult);
                },
            };
        },
    };
};
