import { meros as merosIncomingMessage } from 'meros/node';
import { meros as merosReadableStream } from 'meros/browser';
import { mapAsyncIterator } from '@graphql-tools/utils';
import { dset } from 'dset/merge';
import { addCancelToResponseStream } from './event-stream/addCancelToResponseStream.js';
function isIncomingMessage(body) {
    return body != null && typeof body === 'object' && 'pipe' in body;
}
export async function handleMultipartMixedResponse(response, controller) {
    const body = await response.body;
    const contentType = response.headers.get('content-type') || '';
    let asyncIterator;
    if (isIncomingMessage(body)) {
        // Meros/node expects headers as an object map with the content-type prop
        body.headers = {
            'content-type': contentType,
        };
        // And it expects `IncomingMessage` and `node-fetch` returns `body` as `Promise<PassThrough>`
        asyncIterator = (await merosIncomingMessage(body));
    }
    else {
        // Nothing is needed for regular `Response`.
        asyncIterator = (await merosReadableStream(response));
    }
    const executionResult = {};
    const resultStream = mapAsyncIterator(asyncIterator, (part) => {
        if (part.json) {
            const chunk = part.body;
            if (chunk.path) {
                if (chunk.data) {
                    const path = ['data'];
                    dset(executionResult, path.concat(chunk.path), chunk.data);
                }
                if (chunk.errors) {
                    executionResult.errors = (executionResult.errors || []).concat(chunk.errors);
                }
            }
            else {
                if (chunk.data) {
                    executionResult.data = chunk.data;
                }
                if (chunk.errors) {
                    executionResult.errors = chunk.errors;
                }
            }
            return executionResult;
        }
    });
    if (controller) {
        return addCancelToResponseStream(resultStream, controller);
    }
    return resultStream;
}
