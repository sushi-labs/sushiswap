import { inspect, isAsyncIterable } from '@graphql-tools/utils';
import { handleAsyncIterable } from './handleAsyncIterable.js';
import { handleReadableStream } from './handleReadableStream.js';
import { addCancelToResponseStream } from './addCancelToResponseStream.js';
export function isReadableStream(value) {
    return value && typeof value.getReader === 'function';
}
export async function handleEventStreamResponse(response, controller) {
    // node-fetch returns body as a promise so we need to resolve it
    const body = response.body;
    if (body) {
        if (isReadableStream(body)) {
            return handleReadableStream(body);
        }
        if (isAsyncIterable(body)) {
            const resultStream = handleAsyncIterable(body);
            if (controller) {
                return addCancelToResponseStream(resultStream, controller);
            }
            else {
                return resultStream;
            }
        }
    }
    throw new Error('Response body is expected to be a readable stream but got; ' + inspect(body));
}
