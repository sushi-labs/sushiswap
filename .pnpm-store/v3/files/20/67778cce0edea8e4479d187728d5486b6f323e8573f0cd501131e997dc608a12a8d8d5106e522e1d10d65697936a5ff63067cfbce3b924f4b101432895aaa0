export function isRateLimitError(error) {
    if (error.status !== 403) {
        return false;
    }
    /* istanbul ignore if */
    if (!error.response) {
        return false;
    }
    return error.response.headers["x-ratelimit-remaining"] === "0";
}
