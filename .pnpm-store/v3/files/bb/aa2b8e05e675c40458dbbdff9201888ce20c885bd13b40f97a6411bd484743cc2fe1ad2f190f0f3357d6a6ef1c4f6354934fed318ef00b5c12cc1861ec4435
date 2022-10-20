"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadersRegistry = void 0;
var tslib_1 = require("tslib");
var load_1 = require("@graphql-tools/load");
var merge_1 = require("@graphql-tools/merge");
var graphql_1 = require("graphql");
var index_js_1 = require("./helpers/index.js");
var LoadersRegistry = /** @class */ (function () {
    function LoadersRegistry(_a) {
        var cwd = _a.cwd;
        this._loaders = new Set();
        this._middlewares = [];
        this.cwd = cwd;
    }
    LoadersRegistry.prototype.register = function (loader) {
        this._loaders.add(loader);
    };
    LoadersRegistry.prototype.override = function (loaders) {
        this._loaders = new Set(loaders);
    };
    LoadersRegistry.prototype.use = function (middleware) {
        this._middlewares.push(middleware);
    };
    LoadersRegistry.prototype.loadTypeDefs = function (pointer, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, (0, load_1.loadTypedefs)(pointer, tslib_1.__assign({ loaders: Array.from(this._loaders), cwd: this.cwd }, options))];
            });
        });
    };
    LoadersRegistry.prototype.loadTypeDefsSync = function (pointer, options) {
        return (0, load_1.loadTypedefsSync)(pointer, this.createOptions(options));
    };
    LoadersRegistry.prototype.loadDocuments = function (pointer, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, (0, load_1.loadDocuments)(pointer, this.createOptions(options))];
            });
        });
    };
    LoadersRegistry.prototype.loadDocumentsSync = function (pointer, options) {
        return (0, load_1.loadDocumentsSync)(pointer, this.createOptions(options));
    };
    LoadersRegistry.prototype.loadSchema = function (pointer, out, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loadSchemaOptions, schemaDoc, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        out = out || 'GraphQLSchema';
                        loadSchemaOptions = this.createOptions(options);
                        if (out === 'GraphQLSchema' && !this._middlewares.length) {
                            return [2 /*return*/, (0, load_1.loadSchema)(pointer, loadSchemaOptions)];
                        }
                        _a = this.transformSchemaSources;
                        return [4 /*yield*/, (0, load_1.loadTypedefs)(pointer, tslib_1.__assign({ filterKinds: load_1.OPERATION_KINDS }, loadSchemaOptions))];
                    case 1:
                        schemaDoc = _a.apply(this, [_b.sent()]);
                        // TODO: TS screams about `out` not being compatible with SchemaOutput
                        return [2 /*return*/, this.castSchema(schemaDoc, out)];
                }
            });
        });
    };
    LoadersRegistry.prototype.loadSchemaSync = function (pointer, out, options) {
        out = out || 'GraphQLSchema';
        var loadSchemaOptions = this.createOptions(options);
        if (out === 'GraphQLSchema' && !this._middlewares.length) {
            return (0, load_1.loadSchemaSync)(pointer, loadSchemaOptions);
        }
        var schemaDoc = this.transformSchemaSources((0, load_1.loadTypedefsSync)(pointer, tslib_1.__assign({ filterKinds: load_1.OPERATION_KINDS }, loadSchemaOptions)));
        return this.castSchema(schemaDoc, out);
    };
    LoadersRegistry.prototype.createOptions = function (options) {
        return tslib_1.__assign({ loaders: Array.from(this._loaders), cwd: this.cwd }, options);
    };
    LoadersRegistry.prototype.transformSchemaSources = function (sources) {
        var documents = sources.map(function (source) { return source.document; });
        var document = (0, merge_1.mergeTypeDefs)(documents);
        return (0, index_js_1.useMiddleware)(this._middlewares)(document);
    };
    LoadersRegistry.prototype.castSchema = function (doc, out) {
        if (out === 'DocumentNode') {
            return doc;
        }
        if (out === 'GraphQLSchema') {
            return (0, graphql_1.buildASTSchema)(doc);
        }
        return (0, graphql_1.print)(doc);
    };
    return LoadersRegistry;
}());
exports.LoadersRegistry = LoadersRegistry;
