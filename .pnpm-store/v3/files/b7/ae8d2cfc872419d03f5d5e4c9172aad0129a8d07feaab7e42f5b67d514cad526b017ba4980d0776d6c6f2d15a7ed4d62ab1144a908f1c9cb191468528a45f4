const handleFileRequest = require("./handle-file-request");

module.exports = function createNodePonyfill(opts = {}) {
  const ponyfills = {};

  if (!opts.useNodeFetch) {
    ponyfills.fetch = globalThis.fetch; // To enable: import {fetch} from 'cross-fetch'
    ponyfills.Headers = globalThis.Headers;
    ponyfills.Request = globalThis.Request;
    ponyfills.Response = globalThis.Response;
    ponyfills.FormData = globalThis.FormData;
    ponyfills.File = globalThis.File;
  }

  ponyfills.AbortController = globalThis.AbortController;
  ponyfills.ReadableStream = globalThis.ReadableStream;
  ponyfills.WritableStream = globalThis.WritableStream;
  ponyfills.TransformStream = globalThis.TransformStream;
  ponyfills.Blob = globalThis.Blob;
  ponyfills.crypto = globalThis.crypto;

  if (!ponyfills.AbortController) {
    const abortControllerModule = require("abort-controller");
    ponyfills.AbortController =
      abortControllerModule.default || abortControllerModule;
  }

  if (!ponyfills.Blob) {
    const bufferModule = require('buffer')
    ponyfills.Blob = bufferModule.Blob;
  }

  if (!ponyfills.Blob) {
    const formDataModule = require("formdata-node");
    ponyfills.Blob = formDataModule.Blob
  }

  if (!ponyfills.ReadableStream) {
    try {
      const streamsWeb = require("stream/web");

      ponyfills.ReadableStream = streamsWeb.ReadableStream;
      ponyfills.WritableStream = streamsWeb.WritableStream;
      ponyfills.TransformStream = streamsWeb.TransformStream;
    } catch (e) {
      const streamsWeb = require("web-streams-polyfill/ponyfill");
      ponyfills.ReadableStream = streamsWeb.ReadableStream;
      ponyfills.WritableStream = streamsWeb.WritableStream;
      ponyfills.TransformStream = streamsWeb.TransformStream;
    }
  }

  // ReadableStream doesn't handle aborting properly, so we need to patch it
  ponyfills.ReadableStream = class PonyfillReadableStream extends ponyfills.ReadableStream {
    constructor(underlyingSource, ...opts) {
      super({
        ...underlyingSource,
        cancel: (e) => {
          this.cancelled = true;
          if (underlyingSource.cancel) {
            return underlyingSource.cancel(e);
          }
        }
      }, ...opts);
      this.underlyingSource = underlyingSource;
    }
    [Symbol.asyncIterator]() {
      const asyncIterator = super[Symbol.asyncIterator]();
      return {
        next: (...args) => asyncIterator.next(...args),
        throw: (...args) => asyncIterator.throw(...args),
        return: async (e) => {
          const originalResult = await asyncIterator.return(e);
          if (!this.cancelled) {
            this.cancelled = true;
            if (this.underlyingSource.cancel) {
              await this.underlyingSource.cancel(e);
            }
          }
          return originalResult;
        }
      }
    }
    async cancel(e) {
      const originalResult = !super.locked && await super.cancel(e);
      if (!this.cancelled) {
        this.cancelled = true;
        if (this.underlyingSource.cancel) {
          await this.underlyingSource.cancel(e);
        }
      }
      return originalResult;
    }
  }

  if (!ponyfills.crypto) {
    const cryptoModule = require("crypto");
    ponyfills.crypto = cryptoModule.webcrypto;
  }

  // If any of classes of Fetch API is missing, we need to ponyfill them.
  if (!ponyfills.fetch ||
    !ponyfills.Request ||
    !ponyfills.Headers ||
    !ponyfills.Response ||
    !ponyfills.FormData ||
    !ponyfills.File ||
    opts.useNodeFetch) {

    const [
      nodeMajorStr,
      nodeMinorStr
    ] = process.versions.node.split('.');

    const nodeMajor = parseInt(nodeMajorStr);
    const nodeMinor = parseInt(nodeMinorStr);
    const getFormDataMethod = require('./getFormDataMethod');

    if (!opts.useNodeFetch && (nodeMajor > 16 || (nodeMajor === 16 && nodeMinor >= 5))) {
      const undici = require("undici");

      if (!ponyfills.Headers) {
        ponyfills.Headers = undici.Headers;
      }

      const streams = require("stream");

      const OriginalRequest = ponyfills.Request || undici.Request;

      class Request extends OriginalRequest {
        constructor(requestOrUrl, options) {
          if (typeof requestOrUrl === "string") {
            options = options || {};
            if (options.body != null && options.body.read && options.body.on) {
              const readable = options.body;
              options.body = new ponyfills.ReadableStream({
                pull(controller) {
                  const chunk = readable.read();
                  if (chunk != null) {
                    controller.enqueue(chunk);
                  } else {
                    controller.close();
                  }
                },
                close(e) {
                  readable.destroy(e);
                }
              })
            }
            super(requestOrUrl, options);
            const contentType = this.headers.get("content-type");
            if (contentType && contentType.startsWith("multipart/form-data")) {
              this.headers.set("content-type", contentType.split(', ')[0]);
            }
          } else {
            super(requestOrUrl);
          }
          this.formData = getFormDataMethod(undici.File, opts.formDataLimits);
        }
      }

      ponyfills.Request = Request;

      const originalFetch = ponyfills.fetch || undici.fetch;

      const fetch = function (requestOrUrl, options) {
        if (typeof requestOrUrl === "string") {
          return fetch(new Request(requestOrUrl, options));
        }
        if (requestOrUrl.url.startsWith('file:')) {
          return handleFileRequest(requestOrUrl.url, ponyfills.Response);
        }
        return originalFetch(requestOrUrl);
      };

      ponyfills.fetch = fetch;

      if (!ponyfills.Response) {
        ponyfills.Response = undici.Response;
      }

      if (!ponyfills.FormData) {
        ponyfills.FormData = undici.FormData;
      }

      if (!ponyfills.File) {
        ponyfills.File = undici.File
      }
    } else {
      const nodeFetch = require("node-fetch");
      const realFetch = ponyfills.fetch || nodeFetch.default || nodeFetch;
      if (!ponyfills.Headers) {
        ponyfills.Headers = nodeFetch.Headers;
        // Sveltekit
        if (globalThis.Headers) {
          Object.defineProperty(globalThis.Headers, Symbol.hasInstance, {
            value(obj) {
              return obj.get && obj.set && obj.delete && obj.has && obj.append;
            },
            configurable: true,
          })
        }
      }
      const formDataEncoderModule = require("form-data-encoder");
      const streams = require("stream");
      const formDataModule = require("formdata-node");
      if (!ponyfills.FormData) {
        ponyfills.FormData = formDataModule.FormData
      }
      if (!ponyfills.File) {
        ponyfills.File = formDataModule.File
      }

      const OriginalRequest = ponyfills.Request || nodeFetch.Request;

      class Request extends OriginalRequest {
        constructor(requestOrUrl, options) {
          if (typeof requestOrUrl === "string") {
            // Support schemaless URIs on the server for parity with the browser.
            // Ex: //github.com/ -> https://github.com/
            if (/^\/\//.test(requestOrUrl)) {
              requestOrUrl = "https:" + requestOrUrl;
            }
            options = options || {};
            options.headers = new ponyfills.Headers(options.headers || {});
            options.headers.set('Connection', 'keep-alive');
            if (options.body != null) {
              if (options.body[Symbol.toStringTag] === 'FormData') {
                const encoder = new formDataEncoderModule.FormDataEncoder(options.body)
                for (const headerKey in encoder.headers) {
                  options.headers.set(headerKey, encoder.headers[headerKey])
                }
                options.body = streams.Readable.from(encoder.encode());
              }
              if (options.body[Symbol.toStringTag] === 'ReadableStream') {
                options.body = streamsWeb.Readable.fromWeb ? streams.Readable.fromWeb(options.body) : streams.Readable.from(options.body);
              }
            }
            super(requestOrUrl, options);
          } else {
            super(requestOrUrl);
          }
          this.formData = getFormDataMethod(formDataModule.File, opts.formDataLimits);
        }
      }
      ponyfills.Request = Request;
      const fetch = function (requestOrUrl, options) {
        if (typeof requestOrUrl === "string") {
          return fetch(new Request(requestOrUrl, options));
        }
        if (requestOrUrl.url.startsWith('file:')) {
          return handleFileRequest(requestOrUrl.url, ponyfills.Response);
        }
        return realFetch(requestOrUrl);
      };

      ponyfills.fetch = fetch;

      const OriginalResponse = ponyfills.Response || nodeFetch.Response;
      ponyfills.Response = function Response(body, init) {
        if (body != null && body[Symbol.toStringTag] === 'ReadableStream') {
          const actualBody = streams.Readable.fromWeb ? streams.Readable.fromWeb(body) : streams.Readable.from(body, {
            emitClose: true,
            autoDestroy: true,
          });
          actualBody.on('pause', () => {
            body.cancel();
          })
          actualBody.on('close', () => {
            body.cancel();
          })
          // Polyfill ReadableStream is not working well with node-fetch's Response
          return new OriginalResponse(actualBody, init);
        }
        return new OriginalResponse(body, init);
      };

    }
  }
  return ponyfills;
}
