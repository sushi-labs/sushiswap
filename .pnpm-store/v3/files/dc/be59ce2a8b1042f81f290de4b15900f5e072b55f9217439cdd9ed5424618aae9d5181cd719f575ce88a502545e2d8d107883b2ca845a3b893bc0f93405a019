"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const API_ERROR_MESSAGE = "Unexpected error occurred. \n  Error reason %s %s. \n  Error context: %s";
function logError(error) {
    var _a, _b, _c, _d, _e, _f;
    // api error
    if ("response" in error) {
        const code = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
        const codeText = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.statusText;
        let message = "No message";
        if ((_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message) {
            message = error.response.data.error.message;
        }
        else if ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) {
            message = error.response.data;
        }
        console.log(API_ERROR_MESSAGE, code, codeText, message);
        return;
    }
    // general error
    if (error instanceof Error) {
        console.log(error.message);
    }
}
exports.logError = logError;
//# sourceMappingURL=error_logger.js.map