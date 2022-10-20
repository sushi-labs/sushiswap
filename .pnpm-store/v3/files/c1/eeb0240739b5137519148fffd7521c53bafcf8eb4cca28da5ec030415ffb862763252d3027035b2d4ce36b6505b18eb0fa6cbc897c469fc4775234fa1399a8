"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfigSync = exports.findConfig = void 0;
var tslib_1 = require("tslib");
var errors_js_1 = require("../errors.js");
var cosmiconfig_js_1 = require("./cosmiconfig.js");
var cwd = typeof process !== 'undefined' ? process.cwd() : undefined;
function findConfig(_a) {
    var _b = _a.rootDir, rootDir = _b === void 0 ? cwd : _b, _c = _a.legacy, legacy = _c === void 0 ? true : _c, configName = _a.configName;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _d;
        var _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    validate({ rootDir: rootDir });
                    _d = resolve;
                    _e = {
                        rootDir: rootDir
                    };
                    return [4 /*yield*/, (0, cosmiconfig_js_1.createCosmiConfig)(configName, { legacy: legacy }).search(rootDir)];
                case 1: return [2 /*return*/, _d.apply(void 0, [(_e.result = _f.sent(),
                            _e)])];
            }
        });
    });
}
exports.findConfig = findConfig;
function findConfigSync(_a) {
    var _b = _a.rootDir, rootDir = _b === void 0 ? cwd : _b, _c = _a.legacy, legacy = _c === void 0 ? true : _c, configName = _a.configName;
    validate({ rootDir: rootDir });
    return resolve({
        rootDir: rootDir,
        result: (0, cosmiconfig_js_1.createCosmiConfigSync)(configName, { legacy: legacy }).search(rootDir),
    });
}
exports.findConfigSync = findConfigSync;
//
function validate(_a) {
    var rootDir = _a.rootDir;
    if (!rootDir) {
        throw new Error("Defining a root directory is required");
    }
}
function resolve(_a) {
    var result = _a.result, rootDir = _a.rootDir;
    if (!result) {
        throw new errors_js_1.ConfigNotFoundError((0, errors_js_1.composeMessage)("GraphQL Config file is not available in the provided config directory: ".concat(rootDir), "Please check the config directory."));
    }
    if (result.isEmpty) {
        throw new errors_js_1.ConfigEmptyError((0, errors_js_1.composeMessage)("GraphQL Config file is empty.", "Please check ".concat(result.filepath)));
    }
    return {
        config: result.config,
        filepath: result.filepath,
    };
}
