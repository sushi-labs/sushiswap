import { __assign, __awaiter, __generator } from "tslib";
import { loadSchema, loadSchemaSync, loadTypedefs, loadTypedefsSync, loadDocuments, loadDocumentsSync, OPERATION_KINDS, } from '@graphql-tools/load';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { buildASTSchema, print } from 'graphql';
import { useMiddleware } from './helpers/index.js';
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, loadTypedefs(pointer, __assign({ loaders: Array.from(this._loaders), cwd: this.cwd }, options))];
            });
        });
    };
    LoadersRegistry.prototype.loadTypeDefsSync = function (pointer, options) {
        return loadTypedefsSync(pointer, this.createOptions(options));
    };
    LoadersRegistry.prototype.loadDocuments = function (pointer, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, loadDocuments(pointer, this.createOptions(options))];
            });
        });
    };
    LoadersRegistry.prototype.loadDocumentsSync = function (pointer, options) {
        return loadDocumentsSync(pointer, this.createOptions(options));
    };
    LoadersRegistry.prototype.loadSchema = function (pointer, out, options) {
        return __awaiter(this, void 0, void 0, function () {
            var loadSchemaOptions, schemaDoc, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        out = out || 'GraphQLSchema';
                        loadSchemaOptions = this.createOptions(options);
                        if (out === 'GraphQLSchema' && !this._middlewares.length) {
                            return [2 /*return*/, loadSchema(pointer, loadSchemaOptions)];
                        }
                        _a = this.transformSchemaSources;
                        return [4 /*yield*/, loadTypedefs(pointer, __assign({ filterKinds: OPERATION_KINDS }, loadSchemaOptions))];
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
            return loadSchemaSync(pointer, loadSchemaOptions);
        }
        var schemaDoc = this.transformSchemaSources(loadTypedefsSync(pointer, __assign({ filterKinds: OPERATION_KINDS }, loadSchemaOptions)));
        return this.castSchema(schemaDoc, out);
    };
    LoadersRegistry.prototype.createOptions = function (options) {
        return __assign({ loaders: Array.from(this._loaders), cwd: this.cwd }, options);
    };
    LoadersRegistry.prototype.transformSchemaSources = function (sources) {
        var documents = sources.map(function (source) { return source.document; });
        var document = mergeTypeDefs(documents);
        return useMiddleware(this._middlewares)(document);
    };
    LoadersRegistry.prototype.castSchema = function (doc, out) {
        if (out === 'DocumentNode') {
            return doc;
        }
        if (out === 'GraphQLSchema') {
            return buildASTSchema(doc);
        }
        return print(doc);
    };
    return LoadersRegistry;
}());
export { LoadersRegistry };
