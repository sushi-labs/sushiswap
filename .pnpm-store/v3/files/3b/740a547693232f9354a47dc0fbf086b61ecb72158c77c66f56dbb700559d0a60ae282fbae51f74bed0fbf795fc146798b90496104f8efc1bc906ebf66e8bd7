"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGraphiQL = exports.shouldRenderGraphiQL = exports.GraphQLYogaError = exports.createServer = void 0;
const tslib_1 = require("tslib");
const http_1 = require("http");
const https_1 = require("https");
const http_utils_js_1 = require("./http-utils.js");
const common_1 = require("@graphql-yoga/common");
const os_1 = require("os");
const cross_undici_fetch_1 = require("cross-undici-fetch");
class YogaNodeServer extends common_1.YogaServer {
    constructor(options) {
        var _a, _b;
        super({
            ...options,
            multipart: (options === null || options === void 0 ? void 0 : options.multipart) !== false,
            fetchAPI: (_a = options === null || options === void 0 ? void 0 : options.fetchAPI) !== null && _a !== void 0 ? _a : (0, cross_undici_fetch_1.create)({
                useNodeFetch: true,
                formDataLimits: typeof (options === null || options === void 0 ? void 0 : options.multipart) === 'object'
                    ? options.multipart
                    : undefined,
            }),
        });
        this.options = options;
        this.nodeServer = null;
        this.requestListener = async (req, res) => {
            const response = await this.handleIncomingMessage(req, { req, res });
            this.logger.debug('Passing Response back to Node');
            return (0, http_utils_js_1.sendNodeResponse)(response, res);
        };
        this.handle = this.requestListener;
        this.addressInfo = {
            // Windows doesn't support 0.0.0.0 binding
            // We need to use 127.0.0.1 for Windows and WSL
            hostname: (options === null || options === void 0 ? void 0 : options.hostname) ||
                // Is Windows?
                ((0, os_1.platform)() === 'win32' ||
                    // is WSL?
                    (0, os_1.release)().toLowerCase().includes('microsoft')
                    ? '127.0.0.1'
                    : '0.0.0.0'),
            port: (_b = options === null || options === void 0 ? void 0 : options.port) !== null && _b !== void 0 ? _b : parseInt(process.env.PORT || '4000'),
            endpoint: (options === null || options === void 0 ? void 0 : options.endpoint) || '/graphql',
            protocol: (options === null || options === void 0 ? void 0 : options.https) ? 'https' : 'http',
        };
        this.logger.debug('Setting up server.');
    }
    getAddressInfo() {
        return this.addressInfo;
    }
    getServerUrl() {
        return `${this.addressInfo.protocol}://${this.addressInfo.hostname}:${this.addressInfo.port}${this.addressInfo.endpoint}`;
    }
    async handleIncomingMessage(nodeRequest, serverContext) {
        this.logger.debug(`Processing Node Request`);
        const request = (0, http_utils_js_1.getNodeRequest)(nodeRequest, this.addressInfo, this.fetchAPI.Request);
        const response = await this.handleRequest(request, serverContext);
        return response;
    }
    /**
     * @deprecated Will be removed in the next major. Get the server from `.start()` instead
     */
    getNodeServer() {
        this.logger.warn(`getNodeServer() is deprecated. You should get the server instance from ".start()" method instead`);
        return this.getOrCreateNodeServer();
    }
    // Will be moved to `start` method once `getNodeServer` method is removed completely
    getOrCreateNodeServer() {
        var _a, _b;
        if (!this.nodeServer) {
            this.endpoint = this.endpoint || '/graphql';
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.https) {
                this.nodeServer =
                    typeof ((_b = this.options) === null || _b === void 0 ? void 0 : _b.https) === 'object'
                        ? (0, https_1.createServer)(this.options.https, this.requestListener)
                        : (0, https_1.createServer)(this.requestListener);
            }
            else {
                this.nodeServer = (0, http_1.createServer)(this.requestListener);
            }
        }
        return this.nodeServer;
    }
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.getOrCreateNodeServer().listen(this.addressInfo.port, this.addressInfo.hostname, () => {
                    const serverUrl = this.getServerUrl();
                    this.logger.info(`Running GraphQL Server at ${serverUrl}`);
                    resolve(this.nodeServer);
                });
            }
            catch (e) {
                this.logger.error(`GraphQL Server couldn't start;\n${e.stack}`);
                reject(e);
            }
        });
    }
    stop() {
        this.logger.info('Shutting down GraphQL Server');
        return new Promise((resolve, reject) => {
            if (this.nodeServer == null) {
                reject(new Error('GraphQL Server is not running'));
                return;
            }
            this.nodeServer.close((err) => {
                if (err != null) {
                    this.logger.error(`Something went wrong while trying to shutdown the server;\n${err.stack}`);
                    reject(err);
                }
                else {
                    this.logger.info(`Stopped GraphQL Server successfully`);
                    resolve();
                }
            });
        });
    }
}
/**
 * Create a simple yet powerful GraphQL server ready for production workloads.
 * Spec compliant server that supports bleeding edge GraphQL features without any vendor lock-ins.
 *
 * Comes baked in with:
 *
 * - Envelop - Plugin system for GraphQL
 * - GraphiQL - GraphQL IDE for your browser
 *
 * Example:
 * ```ts
 *  import { schema } from './schema.js'
 *   // Provide a GraphQL schema
 *  const server = createServer({ schema })
 *  // Start the server. Defaults to http://localhost:4000/graphql
 *  server.start()
 * ```
 */
function createServer(options) {
    const server = new YogaNodeServer(options);
    return new Proxy(server.requestListener, {
        get: (_, prop) => {
            if (server[prop]) {
                if (server[prop].bind) {
                    return server[prop].bind(server);
                }
                return server[prop];
            }
            if (server.requestListener[prop]) {
                if (server.requestListener[prop].bind) {
                    return server.requestListener[prop].bind(server.requestListener);
                }
                return server.requestListener[prop];
            }
        },
        apply: (_, __, [req, res]) => server.requestListener(req, res),
    });
}
exports.createServer = createServer;
tslib_1.__exportStar(require("./types.js"), exports);
var common_2 = require("@graphql-yoga/common");
Object.defineProperty(exports, "GraphQLYogaError", { enumerable: true, get: function () { return common_2.GraphQLYogaError; } });
Object.defineProperty(exports, "shouldRenderGraphiQL", { enumerable: true, get: function () { return common_2.shouldRenderGraphiQL; } });
Object.defineProperty(exports, "renderGraphiQL", { enumerable: true, get: function () { return common_2.renderGraphiQL; } });
tslib_1.__exportStar(require("@envelop/core"), exports);
tslib_1.__exportStar(require("@graphql-yoga/subscription"), exports);
