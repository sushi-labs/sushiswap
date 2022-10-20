const streams = require('stream');

module.exports = function readableStreamToReadable(readableStream) {
    return streams.Readable.from({
            [Symbol.asyncIterator]() {
              const reader = readableStream.getReader();
              return {
                next() {
                  return reader.read();
                },
                async return() {
                  reader.releaseLock();
                  await readableStream.cancel();
                  return Promise.resolve({ done: true });
                }
              }
            }
          });
}