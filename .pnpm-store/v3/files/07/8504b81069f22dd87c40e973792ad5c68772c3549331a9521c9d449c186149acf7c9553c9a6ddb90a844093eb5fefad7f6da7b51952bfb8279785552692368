"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDetailedError = exports.DetailedError = void 0;
class DetailedError extends Error {
    constructor(message, details, source) {
        super(message);
        this.message = message;
        this.details = details;
        this.source = source;
        Object.setPrototypeOf(this, DetailedError.prototype);
        Error.captureStackTrace(this, DetailedError);
    }
}
exports.DetailedError = DetailedError;
function isDetailedError(error) {
    return error.details;
}
exports.isDetailedError = isDetailedError;
