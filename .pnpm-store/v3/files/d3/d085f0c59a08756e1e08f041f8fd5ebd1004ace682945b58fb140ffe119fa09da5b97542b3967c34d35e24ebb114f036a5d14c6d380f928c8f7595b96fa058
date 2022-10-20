"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePayloadFormatter = void 0;
const utils_js_1 = require("../utils.js");
const makeHandleResult = (formatter) => ({ args, result, setResult, }) => {
    const modified = formatter(result, args);
    if (modified !== false) {
        setResult(modified);
    }
};
const usePayloadFormatter = (formatter) => ({
    onExecute() {
        const handleResult = makeHandleResult(formatter);
        return {
            onExecuteDone(payload) {
                return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
            },
        };
    },
});
exports.usePayloadFormatter = usePayloadFormatter;
