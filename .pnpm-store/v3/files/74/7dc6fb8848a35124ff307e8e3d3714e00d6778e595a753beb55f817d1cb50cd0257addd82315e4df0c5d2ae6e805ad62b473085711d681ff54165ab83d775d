"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownSignerError = void 0;
class UnknownSignerError extends Error {
    constructor(data) {
        super(`Unknown Signer for account: ${data.from} Trying to execute the following::\n ${JSON.stringify(data, null, '  ')}`);
        this.data = data;
        Error.captureStackTrace(this, UnknownSignerError);
    }
}
exports.UnknownSignerError = UnknownSignerError;
//# sourceMappingURL=errors.js.map