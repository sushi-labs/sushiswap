"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLConfig = exports.loadConfigSync = exports.loadConfig = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var project_config_js_1 = require("./project-config.js");
var index_js_1 = require("./helpers/index.js");
var errors_js_1 = require("./errors.js");
var extension_js_1 = require("./extension.js");
var endpoints_js_1 = require("./extensions/endpoints.js");
var cosmiconfig_js_1 = require("./helpers/cosmiconfig.js");
var cwd = typeof process !== 'undefined' ? process.cwd() : undefined;
var defaultConfigName = 'graphql';
var defaultLoadConfigOptions = {
    rootDir: cwd,
    extensions: [],
    throwOnMissing: true,
    throwOnEmpty: true,
    configName: defaultConfigName,
    legacy: true,
};
function loadConfig(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, filepath, configName, rootDir, extensions, throwOnEmpty, throwOnMissing, legacy, found, _b, error_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = tslib_1.__assign(tslib_1.__assign({}, defaultLoadConfigOptions), options), filepath = _a.filepath, configName = _a.configName, rootDir = _a.rootDir, extensions = _a.extensions, throwOnEmpty = _a.throwOnEmpty, throwOnMissing = _a.throwOnMissing, legacy = _a.legacy;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    if (!filepath) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, index_js_1.getConfig)({
                            filepath: filepath,
                            configName: configName,
                            legacy: legacy,
                        })];
                case 2:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, index_js_1.findConfig)({
                        rootDir: rootDir,
                        configName: configName,
                        legacy: legacy,
                    })];
                case 4:
                    _b = _c.sent();
                    _c.label = 5;
                case 5:
                    found = _b;
                    return [2 /*return*/, new GraphQLConfig(found, extensions)];
                case 6:
                    error_1 = _c.sent();
                    return [2 /*return*/, handleError(error_1, { throwOnMissing: throwOnMissing, throwOnEmpty: throwOnEmpty })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.loadConfig = loadConfig;
function loadConfigSync(options) {
    var _a = tslib_1.__assign(tslib_1.__assign({}, defaultLoadConfigOptions), options), filepath = _a.filepath, configName = _a.configName, rootDir = _a.rootDir, extensions = _a.extensions, throwOnEmpty = _a.throwOnEmpty, throwOnMissing = _a.throwOnMissing, legacy = _a.legacy;
    try {
        var found = filepath
            ? (0, index_js_1.getConfigSync)({
                filepath: filepath,
                configName: configName,
                legacy: legacy,
            })
            : (0, index_js_1.findConfigSync)({
                rootDir: rootDir,
                configName: configName,
                legacy: legacy,
            });
        return new GraphQLConfig(found, extensions);
    }
    catch (error) {
        return handleError(error, { throwOnMissing: throwOnMissing, throwOnEmpty: throwOnEmpty });
    }
}
exports.loadConfigSync = loadConfigSync;
function handleError(error, options) {
    if ((!options.throwOnMissing && error instanceof errors_js_1.ConfigNotFoundError) ||
        (!options.throwOnEmpty && error instanceof errors_js_1.ConfigEmptyError)) {
        return;
    }
    throw error;
}
var GraphQLConfig = /** @class */ (function () {
    function GraphQLConfig(raw, extensions) {
        // TODO: in v5 change projects to `Object.create(null)` and refactor `graphql-codegen-cli` to remove `projects.hasOwnProperty`
        // https://github.com/dotansimha/graphql-code-generator/blob/3c6abbde7a20515d9a1d55b4003ef365d248efb5/packages/graphql-codegen-cli/src/graphql-config.ts#L62-L72
        this.projects = {};
        this._rawConfig = raw.config;
        this.filepath = raw.filepath;
        this.dirpath = (0, path_1.dirname)(raw.filepath);
        this.extensions = new extension_js_1.GraphQLExtensionsRegistry({ cwd: this.dirpath });
        // Register Endpoints
        this.extensions.register(endpoints_js_1.EndpointsExtension);
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var extension = extensions_1[_i];
            this.extensions.register(extension);
        }
        if ((0, index_js_1.isMultipleProjectConfig)(this._rawConfig)) {
            for (var _a = 0, _b = Object.entries(this._rawConfig.projects); _a < _b.length; _a++) {
                var _c = _b[_a], projectName = _c[0], config = _c[1];
                this.projects[projectName] = new project_config_js_1.GraphQLProjectConfig({
                    filepath: this.filepath,
                    name: projectName,
                    config: config,
                    extensionsRegistry: this.extensions,
                });
            }
        }
        else if ((0, index_js_1.isSingleProjectConfig)(this._rawConfig) || (0, index_js_1.isLegacyProjectConfig)(this._rawConfig)) {
            this.projects.default = new project_config_js_1.GraphQLProjectConfig({
                filepath: this.filepath,
                name: 'default',
                config: this._rawConfig,
                extensionsRegistry: this.extensions,
            });
        }
    }
    GraphQLConfig.prototype.getProject = function (name) {
        if (!name) {
            return this.getDefault();
        }
        var project = this.projects[name];
        if (!project) {
            throw new errors_js_1.ProjectNotFoundError("Project '".concat(name, "' not found"));
        }
        return project;
    };
    GraphQLConfig.prototype.getProjectForFile = function (filepath) {
        // Looks for a project that includes the file or the file is a part of schema or documents
        for (var _i = 0, _a = Object.values(this.projects); _i < _a.length; _i++) {
            var project = _a[_i];
            if (project.match(filepath)) {
                return project;
            }
        }
        // The file doesn't match any of the project
        // Looks for a first project that has no `include` and `exclude`
        for (var _b = 0, _c = Object.values(this.projects); _b < _c.length; _b++) {
            var project = _c[_b];
            if (!project.include && !project.exclude) {
                return project;
            }
        }
        throw new errors_js_1.ProjectNotFoundError("File '".concat(filepath, "' doesn't match any project"));
    };
    GraphQLConfig.prototype.getDefault = function () {
        return this.getProject('default');
    };
    GraphQLConfig.prototype.isLegacy = function () {
        return (0, cosmiconfig_js_1.isLegacyConfig)(this.filepath);
    };
    return GraphQLConfig;
}());
exports.GraphQLConfig = GraphQLConfig;
