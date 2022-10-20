"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLWebSocketClient = exports.gql = exports.resolveRequestDocument = exports.batchRequests = exports.request = exports.rawRequest = exports.GraphQLClient = exports.ClientError = void 0;
var cross_fetch_1 = __importStar(require("cross-fetch")), CrossFetch = cross_fetch_1;
var parser_1 = require("graphql/language/parser");
var printer_1 = require("graphql/language/printer");
var createRequestBody_1 = __importDefault(require("./createRequestBody"));
var defaultJsonSerializer_1 = require("./defaultJsonSerializer");
var parseArgs_1 = require("./parseArgs");
var types_1 = require("./types");
Object.defineProperty(exports, "ClientError", { enumerable: true, get: function () { return types_1.ClientError; } });
/**
 * Convert the given headers configuration into a plain object.
 */
var resolveHeaders = function (headers) {
    var oHeaders = {};
    if (headers) {
        if ((typeof Headers !== 'undefined' && headers instanceof Headers) ||
            (CrossFetch && CrossFetch.Headers && headers instanceof CrossFetch.Headers)) {
            oHeaders = HeadersInstanceToPlainObject(headers);
        }
        else if (Array.isArray(headers)) {
            headers.forEach(function (_a) {
                var name = _a[0], value = _a[1];
                oHeaders[name] = value;
            });
        }
        else {
            oHeaders = headers;
        }
    }
    return oHeaders;
};
/**
 * Clean a GraphQL document to send it via a GET query
 *
 * @param {string} str GraphQL query
 * @returns {string} Cleaned query
 */
var queryCleanner = function (str) { return str.replace(/([\s,]|#[^\n\r]+)+/g, ' ').trim(); };
/**
 * Create query string for GraphQL request
 *
 * @param {object} param0 -
 *
 * @param {string|string[]} param0.query the GraphQL document or array of document if it's a batch request
 * @param {string|undefined} param0.operationName the GraphQL operation name
 * @param {any|any[]} param0.variables the GraphQL variables to use
 */
var buildGetQueryParams = function (_a) {
    var query = _a.query, variables = _a.variables, operationName = _a.operationName, jsonSerializer = _a.jsonSerializer;
    if (!Array.isArray(query)) {
        var search = ["query=" + encodeURIComponent(queryCleanner(query))];
        if (variables) {
            search.push("variables=" + encodeURIComponent(jsonSerializer.stringify(variables)));
        }
        if (operationName) {
            search.push("operationName=" + encodeURIComponent(operationName));
        }
        return search.join('&');
    }
    if (typeof variables !== 'undefined' && !Array.isArray(variables)) {
        throw new Error('Cannot create query with given variable type, array expected');
    }
    // Batch support
    var payload = query.reduce(function (accu, currentQuery, index) {
        accu.push({
            query: queryCleanner(currentQuery),
            variables: variables ? jsonSerializer.stringify(variables[index]) : undefined,
        });
        return accu;
    }, []);
    return "query=" + encodeURIComponent(jsonSerializer.stringify(payload));
};
/**
 * Fetch data using POST method
 */
var post = function (_a) {
    var url = _a.url, query = _a.query, variables = _a.variables, operationName = _a.operationName, headers = _a.headers, fetch = _a.fetch, fetchOptions = _a.fetchOptions, middleware = _a.middleware;
    return __awaiter(void 0, void 0, void 0, function () {
        var body, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = createRequestBody_1.default(query, variables, operationName, fetchOptions.jsonSerializer);
                    options = __assign({ method: 'POST', headers: __assign(__assign({}, (typeof body === 'string' ? { 'Content-Type': 'application/json' } : {})), headers), body: body }, fetchOptions);
                    if (!middleware) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve(middleware(options))];
                case 1:
                    options = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, fetch(url, options)];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
/**
 * Fetch data using GET method
 */
var get = function (_a) {
    var url = _a.url, query = _a.query, variables = _a.variables, operationName = _a.operationName, headers = _a.headers, fetch = _a.fetch, fetchOptions = _a.fetchOptions, middleware = _a.middleware;
    return __awaiter(void 0, void 0, void 0, function () {
        var queryParams, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    queryParams = buildGetQueryParams({
                        query: query,
                        variables: variables,
                        operationName: operationName,
                        jsonSerializer: fetchOptions.jsonSerializer,
                    });
                    options = __assign({ method: 'GET', headers: headers }, fetchOptions);
                    if (!middleware) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve(middleware(options))];
                case 1:
                    options = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, fetch(url + "?" + queryParams, options)];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
/**
 * GraphQL Client.
 */
var GraphQLClient = /** @class */ (function () {
    function GraphQLClient(url, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.options = options;
    }
    GraphQLClient.prototype.rawRequest = function (queryOrOptions, variables, requestHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var rawRequestOptions, _a, headers, _b, fetch, _c, method, requestMiddleware, responseMiddleware, fetchOptions, url, operationName;
            return __generator(this, function (_d) {
                rawRequestOptions = parseArgs_1.parseRawRequestArgs(queryOrOptions, variables, requestHeaders);
                _a = this.options, headers = _a.headers, _b = _a.fetch, fetch = _b === void 0 ? cross_fetch_1.default : _b, _c = _a.method, method = _c === void 0 ? 'POST' : _c, requestMiddleware = _a.requestMiddleware, responseMiddleware = _a.responseMiddleware, fetchOptions = __rest(_a, ["headers", "fetch", "method", "requestMiddleware", "responseMiddleware"]);
                url = this.url;
                if (rawRequestOptions.signal !== undefined) {
                    fetchOptions.signal = rawRequestOptions.signal;
                }
                operationName = resolveRequestDocument(rawRequestOptions.query).operationName;
                return [2 /*return*/, makeRequest({
                        url: url,
                        query: rawRequestOptions.query,
                        variables: rawRequestOptions.variables,
                        headers: __assign(__assign({}, resolveHeaders(callOrIdentity(headers))), resolveHeaders(rawRequestOptions.requestHeaders)),
                        operationName: operationName,
                        fetch: fetch,
                        method: method,
                        fetchOptions: fetchOptions,
                        middleware: requestMiddleware,
                    })
                        .then(function (response) {
                        if (responseMiddleware) {
                            responseMiddleware(response);
                        }
                        return response;
                    })
                        .catch(function (error) {
                        if (responseMiddleware) {
                            responseMiddleware(error);
                        }
                        throw error;
                    })];
            });
        });
    };
    GraphQLClient.prototype.request = function (documentOrOptions) {
        var variablesAndRequestHeaders = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            variablesAndRequestHeaders[_i - 1] = arguments[_i];
        }
        var variables = variablesAndRequestHeaders[0], requestHeaders = variablesAndRequestHeaders[1];
        var requestOptions = parseArgs_1.parseRequestArgs(documentOrOptions, variables, requestHeaders);
        var _a = this.options, headers = _a.headers, _b = _a.fetch, fetch = _b === void 0 ? cross_fetch_1.default : _b, _c = _a.method, method = _c === void 0 ? 'POST' : _c, requestMiddleware = _a.requestMiddleware, responseMiddleware = _a.responseMiddleware, fetchOptions = __rest(_a, ["headers", "fetch", "method", "requestMiddleware", "responseMiddleware"]);
        var url = this.url;
        if (requestOptions.signal !== undefined) {
            fetchOptions.signal = requestOptions.signal;
        }
        var _d = resolveRequestDocument(requestOptions.document), query = _d.query, operationName = _d.operationName;
        return makeRequest({
            url: url,
            query: query,
            variables: requestOptions.variables,
            headers: __assign(__assign({}, resolveHeaders(callOrIdentity(headers))), resolveHeaders(requestOptions.requestHeaders)),
            operationName: operationName,
            fetch: fetch,
            method: method,
            fetchOptions: fetchOptions,
            middleware: requestMiddleware,
        })
            .then(function (response) {
            if (responseMiddleware) {
                responseMiddleware(response);
            }
            return response.data;
        })
            .catch(function (error) {
            if (responseMiddleware) {
                responseMiddleware(error);
            }
            throw error;
        });
    };
    GraphQLClient.prototype.batchRequests = function (documentsOrOptions, requestHeaders) {
        var batchRequestOptions = parseArgs_1.parseBatchRequestArgs(documentsOrOptions, requestHeaders);
        var _a = this.options, headers = _a.headers, _b = _a.fetch, fetch = _b === void 0 ? cross_fetch_1.default : _b, _c = _a.method, method = _c === void 0 ? 'POST' : _c, requestMiddleware = _a.requestMiddleware, responseMiddleware = _a.responseMiddleware, fetchOptions = __rest(_a, ["headers", "fetch", "method", "requestMiddleware", "responseMiddleware"]);
        var url = this.url;
        if (batchRequestOptions.signal !== undefined) {
            fetchOptions.signal = batchRequestOptions.signal;
        }
        var queries = batchRequestOptions.documents.map(function (_a) {
            var document = _a.document;
            return resolveRequestDocument(document).query;
        });
        var variables = batchRequestOptions.documents.map(function (_a) {
            var variables = _a.variables;
            return variables;
        });
        return makeRequest({
            url: url,
            query: queries,
            variables: variables,
            headers: __assign(__assign({}, resolveHeaders(callOrIdentity(headers))), resolveHeaders(batchRequestOptions.requestHeaders)),
            operationName: undefined,
            fetch: fetch,
            method: method,
            fetchOptions: fetchOptions,
            middleware: requestMiddleware,
        })
            .then(function (response) {
            if (responseMiddleware) {
                responseMiddleware(response);
            }
            return response.data;
        })
            .catch(function (error) {
            if (responseMiddleware) {
                responseMiddleware(error);
            }
            throw error;
        });
    };
    GraphQLClient.prototype.setHeaders = function (headers) {
        this.options.headers = headers;
        return this;
    };
    /**
     * Attach a header to the client. All subsequent requests will have this header.
     */
    GraphQLClient.prototype.setHeader = function (key, value) {
        var _a;
        var headers = this.options.headers;
        if (headers) {
            // todo what if headers is in nested array form... ?
            //@ts-ignore
            headers[key] = value;
        }
        else {
            this.options.headers = (_a = {}, _a[key] = value, _a);
        }
        return this;
    };
    /**
     * Change the client endpoint. All subsequent requests will send to this endpoint.
     */
    GraphQLClient.prototype.setEndpoint = function (value) {
        this.url = value;
        return this;
    };
    return GraphQLClient;
}());
exports.GraphQLClient = GraphQLClient;
function makeRequest(_a) {
    var url = _a.url, query = _a.query, variables = _a.variables, headers = _a.headers, operationName = _a.operationName, fetch = _a.fetch, _b = _a.method, method = _b === void 0 ? 'POST' : _b, fetchOptions = _a.fetchOptions, middleware = _a.middleware;
    return __awaiter(this, void 0, void 0, function () {
        var fetcher, isBathchingQuery, response, result, successfullyReceivedData, successfullyPassedErrorPolicy, headers_1, status_1, errors, rest, data, errorResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fetcher = method.toUpperCase() === 'POST' ? post : get;
                    isBathchingQuery = Array.isArray(query);
                    return [4 /*yield*/, fetcher({
                            url: url,
                            query: query,
                            variables: variables,
                            operationName: operationName,
                            headers: headers,
                            fetch: fetch,
                            fetchOptions: fetchOptions,
                            middleware: middleware,
                        })];
                case 1:
                    response = _c.sent();
                    return [4 /*yield*/, getResult(response, fetchOptions.jsonSerializer)];
                case 2:
                    result = _c.sent();
                    successfullyReceivedData = isBathchingQuery && Array.isArray(result) ? !result.some(function (_a) {
                        var data = _a.data;
                        return !data;
                    }) : !!result.data;
                    successfullyPassedErrorPolicy = !result.errors || fetchOptions.errorPolicy === 'all' || fetchOptions.errorPolicy === 'ignore';
                    if (response.ok && successfullyPassedErrorPolicy && successfullyReceivedData) {
                        headers_1 = response.headers, status_1 = response.status;
                        errors = result.errors, rest = __rest(result, ["errors"]);
                        data = fetchOptions.errorPolicy === 'ignore' ? rest : result;
                        return [2 /*return*/, __assign(__assign({}, (isBathchingQuery ? { data: data } : data)), { headers: headers_1, status: status_1 })];
                    }
                    else {
                        errorResult = typeof result === 'string' ? { error: result } : result;
                        throw new types_1.ClientError(__assign(__assign({}, errorResult), { status: response.status, headers: response.headers }), { query: query, variables: variables });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function rawRequest(urlOrOptions, query, variables, requestHeaders) {
    return __awaiter(this, void 0, void 0, function () {
        var requestOptions, client;
        return __generator(this, function (_a) {
            requestOptions = parseArgs_1.parseRawRequestExtendedArgs(urlOrOptions, query, variables, requestHeaders);
            client = new GraphQLClient(requestOptions.url);
            return [2 /*return*/, client.rawRequest(__assign({}, requestOptions))];
        });
    });
}
exports.rawRequest = rawRequest;
function request(urlOrOptions, document) {
    var variablesAndRequestHeaders = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        variablesAndRequestHeaders[_i - 2] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var variables, requestHeaders, requestOptions, client;
        return __generator(this, function (_a) {
            variables = variablesAndRequestHeaders[0], requestHeaders = variablesAndRequestHeaders[1];
            requestOptions = parseArgs_1.parseRequestExtendedArgs(urlOrOptions, document, variables, requestHeaders);
            client = new GraphQLClient(requestOptions.url);
            return [2 /*return*/, client.request(__assign({}, requestOptions))];
        });
    });
}
exports.request = request;
function batchRequests(urlOrOptions, documents, requestHeaders) {
    return __awaiter(this, void 0, void 0, function () {
        var requestOptions, client;
        return __generator(this, function (_a) {
            requestOptions = parseArgs_1.parseBatchRequestsExtendedArgs(urlOrOptions, documents, requestHeaders);
            client = new GraphQLClient(requestOptions.url);
            return [2 /*return*/, client.batchRequests(__assign({}, requestOptions))];
        });
    });
}
exports.batchRequests = batchRequests;
exports.default = request;
/**
 * todo
 */
function getResult(response, jsonSerializer) {
    if (jsonSerializer === void 0) { jsonSerializer = defaultJsonSerializer_1.defaultJsonSerializer; }
    return __awaiter(this, void 0, void 0, function () {
        var contentType, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    response.headers.forEach(function (value, key) {
                        if (key.toLowerCase() === 'content-type') {
                            contentType = value;
                        }
                    });
                    if (!(contentType && contentType.toLowerCase().startsWith('application/json'))) return [3 /*break*/, 2];
                    _b = (_a = jsonSerializer).parse;
                    return [4 /*yield*/, response.text()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                case 2: return [2 /*return*/, response.text()];
            }
        });
    });
}
/**
 * helpers
 */
function extractOperationName(document) {
    var _a;
    var operationName = undefined;
    var operationDefinitions = document.definitions.filter(function (definition) { return definition.kind === 'OperationDefinition'; });
    if (operationDefinitions.length === 1) {
        operationName = (_a = operationDefinitions[0].name) === null || _a === void 0 ? void 0 : _a.value;
    }
    return operationName;
}
function resolveRequestDocument(document) {
    if (typeof document === 'string') {
        var operationName_1 = undefined;
        try {
            var parsedDocument = parser_1.parse(document);
            operationName_1 = extractOperationName(parsedDocument);
        }
        catch (err) {
            // Failed parsing the document, the operationName will be undefined
        }
        return { query: document, operationName: operationName_1 };
    }
    var operationName = extractOperationName(document);
    return { query: printer_1.print(document), operationName: operationName };
}
exports.resolveRequestDocument = resolveRequestDocument;
function callOrIdentity(value) {
    return typeof value === 'function' ? value() : value;
}
/**
 * Convenience passthrough template tag to get the benefits of tooling for the gql template tag. This does not actually parse the input into a GraphQL DocumentNode like graphql-tag package does. It just returns the string with any variables given interpolated. Can save you a bit of performance and having to install another package.
 *
 * @example
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * @remarks
 *
 * Several tools in the Node GraphQL ecosystem are hardcoded to specially treat any template tag named "gql". For example see this prettier issue: https://github.com/prettier/prettier/issues/4360. Using this template tag has no runtime effect beyond variable interpolation.
 */
function gql(chunks) {
    var variables = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        variables[_i - 1] = arguments[_i];
    }
    return chunks.reduce(function (accumulator, chunk, index) { return "" + accumulator + chunk + (index in variables ? variables[index] : ''); }, '');
}
exports.gql = gql;
/**
 * Convert Headers instance into regular object
 */
function HeadersInstanceToPlainObject(headers) {
    var o = {};
    headers.forEach(function (v, k) {
        o[k] = v;
    });
    return o;
}
var graphql_ws_1 = require("./graphql-ws");
Object.defineProperty(exports, "GraphQLWebSocketClient", { enumerable: true, get: function () { return graphql_ws_1.GraphQLWebSocketClient; } });
//# sourceMappingURL=index.js.map