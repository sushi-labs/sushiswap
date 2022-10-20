import { __assign, __awaiter, __generator } from "tslib";
import { dirname } from 'path';
import { GraphQLProjectConfig } from './project-config.js';
import { isMultipleProjectConfig, isSingleProjectConfig, findConfig, getConfig, getConfigSync, findConfigSync, isLegacyProjectConfig, } from './helpers/index.js';
import { ProjectNotFoundError, ConfigNotFoundError, ConfigEmptyError } from './errors.js';
import { GraphQLExtensionsRegistry } from './extension.js';
import { EndpointsExtension } from './extensions/endpoints.js';
import { isLegacyConfig } from './helpers/cosmiconfig.js';
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
export function loadConfig(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, filepath, configName, rootDir, extensions, throwOnEmpty, throwOnMissing, legacy, found, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = __assign(__assign({}, defaultLoadConfigOptions), options), filepath = _a.filepath, configName = _a.configName, rootDir = _a.rootDir, extensions = _a.extensions, throwOnEmpty = _a.throwOnEmpty, throwOnMissing = _a.throwOnMissing, legacy = _a.legacy;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    if (!filepath) return [3 /*break*/, 3];
                    return [4 /*yield*/, getConfig({
                            filepath: filepath,
                            configName: configName,
                            legacy: legacy,
                        })];
                case 2:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, findConfig({
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
export function loadConfigSync(options) {
    var _a = __assign(__assign({}, defaultLoadConfigOptions), options), filepath = _a.filepath, configName = _a.configName, rootDir = _a.rootDir, extensions = _a.extensions, throwOnEmpty = _a.throwOnEmpty, throwOnMissing = _a.throwOnMissing, legacy = _a.legacy;
    try {
        var found = filepath
            ? getConfigSync({
                filepath: filepath,
                configName: configName,
                legacy: legacy,
            })
            : findConfigSync({
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
function handleError(error, options) {
    if ((!options.throwOnMissing && error instanceof ConfigNotFoundError) ||
        (!options.throwOnEmpty && error instanceof ConfigEmptyError)) {
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
        this.dirpath = dirname(raw.filepath);
        this.extensions = new GraphQLExtensionsRegistry({ cwd: this.dirpath });
        // Register Endpoints
        this.extensions.register(EndpointsExtension);
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var extension = extensions_1[_i];
            this.extensions.register(extension);
        }
        if (isMultipleProjectConfig(this._rawConfig)) {
            for (var _a = 0, _b = Object.entries(this._rawConfig.projects); _a < _b.length; _a++) {
                var _c = _b[_a], projectName = _c[0], config = _c[1];
                this.projects[projectName] = new GraphQLProjectConfig({
                    filepath: this.filepath,
                    name: projectName,
                    config: config,
                    extensionsRegistry: this.extensions,
                });
            }
        }
        else if (isSingleProjectConfig(this._rawConfig) || isLegacyProjectConfig(this._rawConfig)) {
            this.projects.default = new GraphQLProjectConfig({
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
            throw new ProjectNotFoundError("Project '".concat(name, "' not found"));
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
        throw new ProjectNotFoundError("File '".concat(filepath, "' doesn't match any project"));
    };
    GraphQLConfig.prototype.getDefault = function () {
        return this.getProject('default');
    };
    GraphQLConfig.prototype.isLegacy = function () {
        return isLegacyConfig(this.filepath);
    };
    return GraphQLConfig;
}());
export { GraphQLConfig };
