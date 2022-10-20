const handleFileRequest = require("./handle-file-request");
const readableStreamToReadable = require("./readableStreamToReadable");

module.exports = function createNodePonyfill(opts = {}) {

  // Bun already has a Fetch API
  if (process.versions.bun) {
    return globalThis;
  }

  const ponyfills = {};

  if (!opts.useNodeFetch) {
    ponyfills.fetch = globalThis.fetch;
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

  ponyfills.btoa = globalThis.btoa
  if (!ponyfills.btoa) {
    ponyfills.btoa = function btoa(data) {
      return Buffer.from(data, 'binary').toString('base64');
    };
  }

  ponyfills.TextEncoder = function TextEncoder(encoding = 'utf-8') {
    return {
      encode(str) {
        return Buffer.from(str, encoding);
      }
    }
  }

  ponyfills.TextDecoder = function TextDecoder(encoding = 'utf-8') {
    return {
      decode(buf) {
        return Buffer.from(buf).toString(encoding);
      }
    }
  }

  if (!ponyfills.crypto) {
    const cryptoModule = require("crypto");
    ponyfills.crypto = cryptoModule.webcrypto;
  }

  if (!ponyfills.crypto) {
    const cryptoPonyfill = require('@peculiar/webcrypto');
    ponyfills.crypto = new cryptoPonyfill.Crypto();
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
          if (typeof requestOrUrl === "string" || requestOrUrl instanceof URL) {
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
        if (typeof requestOrUrl === "string" || requestOrUrl instanceof URL) {
          // We cannot use our ctor because it leaks on Node 18's global fetch
          return originalFetch(requestOrUrl, options);
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
        if (globalThis.Headers && nodeMajor < 18) {
          Object.defineProperty(globalThis.Headers, Symbol.hasInstance, {
            value(obj) {
              return obj && obj.get && obj.set && obj.delete && obj.has && obj.append;
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
          if (typeof requestOrUrl === "string" || requestOrUrl instanceof URL) {
            // Support schemaless URIs on the server for parity with the browser.
            // Ex: //github.com/ -> https://github.com/
            if (/^\/\//.test(requestOrUrl.toString())) {
              requestOrUrl = "https:" + requestOrUrl.toString();
            }
            const fixedOptions = {
              ...options
            };
            fixedOptions.headers = new ponyfills.Headers(fixedOptions.headers || {});
            fixedOptions.headers.set('Connection', 'keep-alive');
            if (fixedOptions.body != null) {
              if (fixedOptions.body[Symbol.toStringTag] === 'FormData') {
                const encoder = new formDataEncoderModule.FormDataEncoder(fixedOptions.body)
                for (const headerKey in encoder.headers) {
                  fixedOptions.headers.set(headerKey, encoder.headers[headerKey])
                }
                fixedOptions.body = streams.Readable.from(encoder);
              } else if (fixedOptions.body[Symbol.toStringTag] === 'ReadableStream') {
                fixedOptions.body = readableStreamToReadable(fixedOptions.body);
              }
            }
            super(requestOrUrl, fixedOptions);
          } else {
            super(requestOrUrl);
          }
          this.formData = getFormDataMethod(formDataModule.File, opts.formDataLimits);
        }
      }
      ponyfills.Request = Request;
      const fetch = function (requestOrUrl, options) {
        if (typeof requestOrUrl === "string" || requestOrUrl instanceof URL) {
          return fetch(new Request(requestOrUrl, options));
        }
        if (requestOrUrl.url.startsWith('file:')) {
          return handleFileRequest(requestOrUrl.url, ponyfills.Response);
        }
        const abortCtrl = new ponyfills.AbortController();

        return realFetch(requestOrUrl, {
          ...options,
          signal: abortCtrl.signal
        }).then(res => {
          return new Proxy(res, {
            get(target, prop, receiver) {
              if (prop === 'body') {
                return new Proxy(res.body, {
                  get(target, prop, receiver) {
                    if (prop === Symbol.asyncIterator) {
                      return () => {
                        const originalAsyncIterator = target[Symbol.asyncIterator]();
                        return {
                          next() {
                            return originalAsyncIterator.next();
                          },
                          return() {
                            abortCtrl.abort();
                            return originalAsyncIterator.return();
                          },
                          throw(error) {
                            abortCtrl.abort(error);
                            return originalAsyncIterator.throw(error);
                          }
                        }
                      }
                    }
                    return Reflect.get(target, prop, receiver);
                  }
                })
              }
              return Reflect.get(target, prop, receiver);
            }
          })
        });
      };

      ponyfills.fetch = fetch;

      const OriginalResponse = ponyfills.Response || nodeFetch.Response;
      ponyfills.Response = function Response(body, init) {
        if (body != null && body[Symbol.toStringTag] === 'ReadableStream') {
          const actualBody = readableStreamToReadable(body);
          // Polyfill ReadableStream is not working well with node-fetch's Response
          return new OriginalResponse(actualBody, init);
        }
        return new OriginalResponse(body, init);
      };

    }
  }

  if (!ponyfills.Response.redirect) {
    ponyfills.Response.redirect = function (url, status = 302) {
      return new ponyfills.Response(null, {
        status,
        headers: {
          Location: url,
        },
      });
    };
  }
  if (!ponyfills.Response.json) {
    ponyfills.Response.json = function (data, init = {}) {
      return new ponyfills.Response(JSON.stringify(data), {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
        },
      });
    };
  }
  if (!ponyfills.Response.error) {
    ponyfills.Response.error = function () {
      return new ponyfills.Response(null, {
        status: 500,
      });
    };
  }
  return ponyfills;
}
