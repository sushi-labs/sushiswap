export class DetailedError extends Error {
    constructor(message, details, source) {
        super(message);
        this.message = message;
        this.details = details;
        this.source = source;
        Object.setPrototypeOf(this, DetailedError.prototype);
        Error.captureStackTrace(this, DetailedError);
    }
}
export function isDetailedError(error) {
    return error.details;
}
