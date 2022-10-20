"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLProjectConfig = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var minimatch_1 = tslib_1.__importDefault(require("minimatch"));
var errors_js_1 = require("./errors.js");
var index_js_1 = require("./helpers/index.js");
var GraphQLProjectConfig = /** @class */ (function () {
    function GraphQLProjectConfig(_a) {
        var filepath = _a.filepath, name = _a.name, config = _a.config, extensionsRegistry = _a.extensionsRegistry;
        this.filepath = filepath;
        this.dirpath = (0, path_1.dirname)(filepath);
        this.name = name;
        this.extensions = config.extensions || {};
        if ((0, index_js_1.isLegacyProjectConfig)(config)) {
            this.schema = config.schemaPath;
            this.include = config.includes;
            this.exclude = config.excludes;
            this.isLegacy = true;
        }
        else {
            this.schema = config.schema;
            this.documents = config.documents;
            this.include = config.include;
            this.exclude = config.exclude;
            this.isLegacy = false;
        }
        this._extensionsRegistry = extensionsRegistry;
    }
    GraphQLProjectConfig.prototype.hasExtension = function (name) {
        return Boolean(this.extensions[name]);
    };
    GraphQLProjectConfig.prototype.extension = function (name) {
        if (this.isLegacy) {
            var extension_1 = this.extensions[name];
            if (!extension_1) {
                throw new errors_js_1.ExtensionMissingError("Project ".concat(this.name, " is missing ").concat(name, " extension"));
            }
            return extension_1;
        }
        var extension = this._extensionsRegistry.get(name);
        if (!extension) {
            throw new errors_js_1.ExtensionMissingError("Project ".concat(this.name, " is missing ").concat(name, " extension"));
        }
        return tslib_1.__assign(tslib_1.__assign({}, this.extensions[name]), { schema: this.schema, documents: this.documents, include: this.include, exclude: this.exclude });
    };
    GraphQLProjectConfig.prototype.getSchema = function (out) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.loadSchema(this.schema, out)];
            });
        });
    };
    GraphQLProjectConfig.prototype.getSchemaSync = function (out) {
        return this.loadSchemaSync(this.schema, out);
    };
    // Get Documents
    GraphQLProjectConfig.prototype.getDocuments = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.documents) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, this.loadDocuments(this.documents)];
            });
        });
    };
    GraphQLProjectConfig.prototype.getDocumentsSync = function () {
        if (!this.documents) {
            return [];
        }
        return this.loadDocumentsSync(this.documents);
    };
    GraphQLProjectConfig.prototype.loadSchema = function (pointer, out, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._extensionsRegistry.loaders.schema.loadSchema(pointer, out, options)];
            });
        });
    };
    GraphQLProjectConfig.prototype.loadSchemaSync = function (pointer, out, options) {
        return this._extensionsRegistry.loaders.schema.loadSchemaSync(pointer, out, options);
    };
    // Load Documents
    GraphQLProjectConfig.prototype.loadDocuments = function (pointer, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!pointer) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, this._extensionsRegistry.loaders.documents.loadDocuments(pointer, options)];
            });
        });
    };
    GraphQLProjectConfig.prototype.loadDocumentsSync = function (pointer, options) {
        if (!pointer) {
            return [];
        }
        return this._extensionsRegistry.loaders.documents.loadDocumentsSync(pointer, options);
    };
    // Rest
    GraphQLProjectConfig.prototype.match = function (filepath) {
        var _this = this;
        var isSchemaOrDocument = [this.schema, this.documents].some(function (pointer) { return match(filepath, _this.dirpath, pointer); });
        if (isSchemaOrDocument) {
            return true;
        }
        var isExcluded = this.exclude ? match(filepath, this.dirpath, this.exclude) : false;
        if (isExcluded) {
            return false;
        }
        return this.include ? match(filepath, this.dirpath, this.include) : false;
    };
    return GraphQLProjectConfig;
}());
exports.GraphQLProjectConfig = GraphQLProjectConfig;
// XXX: it works but uses nodejs - expose normalization of file and dir paths in config
function match(filepath, dirpath, pointer) {
    if (!pointer) {
        return false;
    }
    if (Array.isArray(pointer)) {
        return pointer.some(function (p) { return match(filepath, dirpath, p); });
    }
    if (typeof pointer === 'string') {
        var normalizedFilepath = (0, path_1.normalize)((0, path_1.isAbsolute)(filepath) ? (0, path_1.relative)(dirpath, filepath) : filepath);
        return (0, minimatch_1.default)(normalizedFilepath, (0, path_1.normalize)(pointer), { dot: true });
    }
    if (typeof pointer === 'object') {
        return match(filepath, dirpath, Object.keys(pointer)[0]);
    }
    return false;
}
