"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBatchRequestsExtendedArgs = exports.parseRawRequestExtendedArgs = exports.parseRequestExtendedArgs = exports.parseBatchRequestArgs = exports.parseRawRequestArgs = exports.parseRequestArgs = void 0;
function parseRequestArgs(documentOrOptions, variables, requestHeaders) {
    return documentOrOptions.document
        ? documentOrOptions
        : {
            document: documentOrOptions,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseRequestArgs = parseRequestArgs;
function parseRawRequestArgs(queryOrOptions, variables, requestHeaders) {
    return queryOrOptions.query
        ? queryOrOptions
        : {
            query: queryOrOptions,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseRawRequestArgs = parseRawRequestArgs;
function parseBatchRequestArgs(documentsOrOptions, requestHeaders) {
    return documentsOrOptions.documents
        ? documentsOrOptions
        : {
            documents: documentsOrOptions,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseBatchRequestArgs = parseBatchRequestArgs;
function parseRequestExtendedArgs(urlOrOptions, document, variables, requestHeaders) {
    return urlOrOptions.document
        ? urlOrOptions
        : {
            url: urlOrOptions,
            document: document,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseRequestExtendedArgs = parseRequestExtendedArgs;
function parseRawRequestExtendedArgs(urlOrOptions, query, variables, requestHeaders) {
    return urlOrOptions.query
        ? urlOrOptions
        : {
            url: urlOrOptions,
            query: query,
            variables: variables,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseRawRequestExtendedArgs = parseRawRequestExtendedArgs;
function parseBatchRequestsExtendedArgs(urlOrOptions, documents, requestHeaders) {
    return urlOrOptions.documents
        ? urlOrOptions
        : {
            url: urlOrOptions,
            documents: documents,
            requestHeaders: requestHeaders,
            signal: undefined,
        };
}
exports.parseBatchRequestsExtendedArgs = parseBatchRequestsExtendedArgs;
//# sourceMappingURL=parseArgs.js.map