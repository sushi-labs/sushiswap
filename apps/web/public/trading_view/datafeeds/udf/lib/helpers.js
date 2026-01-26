/**
 * If you want to enable logs from datafeed set it to `true`
 */
const isLoggingEnabled = false;
export function logMessage(message) {
    if (isLoggingEnabled) {
        const now = new Date();
        // eslint-disable-next-line no-console
        console.log(`${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`);
    }
}
export function getErrorMessage(error) {
    if (error === undefined) {
        return '';
    }
    else if (typeof error === 'string') {
        return error;
    }
    return error.message;
}
