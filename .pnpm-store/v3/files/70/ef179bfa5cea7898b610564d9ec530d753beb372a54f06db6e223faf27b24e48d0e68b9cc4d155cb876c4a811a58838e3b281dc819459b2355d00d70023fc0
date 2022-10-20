"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigSync = exports.getConfig = void 0;
var tslib_1 = require("tslib");
var errors_js_1 = require("../errors.js");
var cosmiconfig_js_1 = require("./cosmiconfig.js");
function getConfig(_a) {
    var filepath = _a.filepath, configName = _a.configName, _b = _a.legacy, legacy = _b === void 0 ? true : _b;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _c;
        var _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    validate({ filepath: filepath });
                    _c = resolve;
                    _d = {};
                    return [4 /*yield*/, (0, cosmiconfig_js_1.createCosmiConfig)(configName, { legacy: legacy }).load(filepath)];
                case 1: return [2 /*return*/, _c.apply(void 0, [(_d.result = _e.sent(),
                            _d.filepath = filepath,
                            _d)])];
            }
        });
    });
}
exports.getConfig = getConfig;
function getConfigSync(_a) {
    var filepath = _a.filepath, configName = _a.configName, _b = _a.legacy, legacy = _b === void 0 ? true : _b;
    validate({ filepath: filepath });
    return resolve({
        result: (0, cosmiconfig_js_1.createCosmiConfigSync)(configName, { legacy: legacy }).load(filepath),
        filepath: filepath,
    });
}
exports.getConfigSync = getConfigSync;
//
function resolve(_a) {
    var result = _a.result, filepath = _a.filepath;
    if (!result) {
        throw new errors_js_1.ConfigNotFoundError((0, errors_js_1.composeMessage)("GraphQL Config file is not available: ".concat(filepath), "Please check the config filepath."));
    }
    if (result.isEmpty) {
        throw new errors_js_1.ConfigEmptyError((0, errors_js_1.composeMessage)("GraphQL Config file is empty.", "Please check ".concat(result.filepath)));
    }
    return {
        config: result.config,
        filepath: result.filepath,
    };
}
function validate(_a) {
    var filepath = _a.filepath;
    if (!filepath) {
        throw new Error("Defining a file path is required");
    }
}
