"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLExtensionsRegistry = void 0;
var graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
var url_loader_1 = require("@graphql-tools/url-loader");
var json_file_loader_1 = require("@graphql-tools/json-file-loader");
var loaders_js_1 = require("./loaders.js");
var GraphQLExtensionsRegistry = /** @class */ (function () {
    function GraphQLExtensionsRegistry(_a) {
        var cwd = _a.cwd;
        this._extensions = {};
        this.loaders = {
            schema: new loaders_js_1.LoadersRegistry({ cwd: cwd }),
            documents: new loaders_js_1.LoadersRegistry({ cwd: cwd }),
        };
        // schema
        this.loaders.schema.register(new graphql_file_loader_1.GraphQLFileLoader());
        this.loaders.schema.register(new url_loader_1.UrlLoader());
        this.loaders.schema.register(new json_file_loader_1.JsonFileLoader());
        // documents
        this.loaders.documents.register(new graphql_file_loader_1.GraphQLFileLoader());
    }
    GraphQLExtensionsRegistry.prototype.register = function (extensionFn) {
        var extension = extensionFn({
            logger: {},
            loaders: this.loaders,
        });
        this._extensions[extension.name] = extension;
    };
    GraphQLExtensionsRegistry.prototype.has = function (extensionName) {
        return !!this._extensions[extensionName];
    };
    GraphQLExtensionsRegistry.prototype.get = function (extensionName) {
        return this._extensions[extensionName];
    };
    GraphQLExtensionsRegistry.prototype.names = function () {
        return Object.keys(this._extensions);
    };
    GraphQLExtensionsRegistry.prototype.forEach = function (cb) {
        for (var extensionName in this._extensions) {
            cb(this._extensions[extensionName]);
        }
    };
    return GraphQLExtensionsRegistry;
}());
exports.GraphQLExtensionsRegistry = GraphQLExtensionsRegistry;
