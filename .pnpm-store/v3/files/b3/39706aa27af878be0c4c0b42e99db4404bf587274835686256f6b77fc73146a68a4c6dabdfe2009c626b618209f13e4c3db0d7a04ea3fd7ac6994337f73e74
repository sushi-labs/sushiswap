"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReadableStream = void 0;
const utils_1 = require("@graphql-tools/utils");
const fetch_1 = require("@whatwg-node/fetch");
const textDecoder = new fetch_1.TextDecoder();
function handleReadableStream(readableStream) {
    return (0, utils_1.observableToAsyncIterable)({
        subscribe: observer => {
            const reader = readableStream.getReader();
            let completed = false;
            function pump() {
                return reader
                    .read()
                    .then(({ done, value }) => {
                    if (completed) {
                        return;
                    }
                    if (value) {
                        const chunk = typeof value === 'string' ? value : textDecoder.decode(value, { stream: true });
                        for (const part of chunk.split('\n\n')) {
                            if (part) {
                                const eventStr = part.split('event: ')[1];
                                const dataStr = part.split('data: ')[1];
                                if (eventStr === 'complete') {
                                    observer.complete();
                                }
                                if (dataStr) {
                                    const data = JSON.parse(dataStr);
                                    observer.next(data.payload || data);
                                }
                            }
                        }
                    }
                    if (done) {
                        observer.complete();
                    }
                    else {
                        pump();
                    }
                })
                    .catch(e => {
                    // canceling a request in browsers throws an error,
                    // ignore it to avoid uncaught promise exceptions
                    if (!completed)
                        throw e;
                });
            }
            pump();
            return {
                unsubscribe: () => {
                    completed = true;
                    reader.cancel().catch(e => {
                        // canceling a request in browsers throws an error,
                        // ignore it to avoid uncaught promise exceptions
                        if (!completed)
                            throw e;
                    });
                },
            };
        },
    });
}
exports.handleReadableStream = handleReadableStream;
