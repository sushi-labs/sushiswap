"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = void 0;
const utils_js_1 = require("../utils.js");
const makeHandleResult = (errorHandler) => ({ result, args }) => {
    var _a;
    if ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) {
        errorHandler(result.errors, args);
    }
};
const useErrorHandler = (errorHandler) => {
    const handleResult = makeHandleResult(errorHandler);
    return {
        onExecute() {
            return {
                onExecuteDone(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
            };
        },
        onSubscribe() {
            return {
                onSubscribeResult(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
            };
        },
    };
};
exports.useErrorHandler = useErrorHandler;
