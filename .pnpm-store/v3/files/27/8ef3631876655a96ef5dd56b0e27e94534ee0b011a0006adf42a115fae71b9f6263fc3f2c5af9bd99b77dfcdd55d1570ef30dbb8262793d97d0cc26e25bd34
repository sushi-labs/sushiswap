import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { UrlLoader } from '@graphql-tools/url-loader';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { LoadersRegistry } from './loaders.js';
var GraphQLExtensionsRegistry = /** @class */ (function () {
    function GraphQLExtensionsRegistry(_a) {
        var cwd = _a.cwd;
        this._extensions = {};
        this.loaders = {
            schema: new LoadersRegistry({ cwd: cwd }),
            documents: new LoadersRegistry({ cwd: cwd }),
        };
        // schema
        this.loaders.schema.register(new GraphQLFileLoader());
        this.loaders.schema.register(new UrlLoader());
        this.loaders.schema.register(new JsonFileLoader());
        // documents
        this.loaders.documents.register(new GraphQLFileLoader());
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
export { GraphQLExtensionsRegistry };
