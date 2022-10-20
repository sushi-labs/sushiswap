import { isAsyncIterable } from '@graphql-tools/utils';
import { encodeString } from '../../encodeString.js';
export function isRegularResult(request, result) {
    return !isAsyncIterable(result);
}
export function processRegularResult(executionResult, fetchAPI) {
    const responseBody = JSON.stringify(executionResult);
    const decodedString = encodeString(responseBody);
    const headersInit = {
        'Content-Type': 'application/json',
        'Content-Length': decodedString.byteLength.toString(),
    };
    const responseInit = {
        headers: headersInit,
        status: 200,
    };
    return new fetchAPI.Response(decodedString, responseInit);
}
