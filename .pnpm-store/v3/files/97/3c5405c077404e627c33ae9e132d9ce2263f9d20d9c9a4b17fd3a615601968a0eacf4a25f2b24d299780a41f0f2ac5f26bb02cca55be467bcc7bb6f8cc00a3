import { __awaiter, __generator } from "tslib";
import { ConfigNotFoundError, ConfigEmptyError, composeMessage } from '../errors.js';
import { createCosmiConfigSync, createCosmiConfig } from './cosmiconfig.js';
export function getConfig(_a) {
    var filepath = _a.filepath, configName = _a.configName, _b = _a.legacy, legacy = _b === void 0 ? true : _b;
    return __awaiter(this, void 0, void 0, function () {
        var _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    validate({ filepath: filepath });
                    _c = resolve;
                    _d = {};
                    return [4 /*yield*/, createCosmiConfig(configName, { legacy: legacy }).load(filepath)];
                case 1: return [2 /*return*/, _c.apply(void 0, [(_d.result = _e.sent(),
                            _d.filepath = filepath,
                            _d)])];
            }
        });
    });
}
export function getConfigSync(_a) {
    var filepath = _a.filepath, configName = _a.configName, _b = _a.legacy, legacy = _b === void 0 ? true : _b;
    validate({ filepath: filepath });
    return resolve({
        result: createCosmiConfigSync(configName, { legacy: legacy }).load(filepath),
        filepath: filepath,
    });
}
//
function resolve(_a) {
    var result = _a.result, filepath = _a.filepath;
    if (!result) {
        throw new ConfigNotFoundError(composeMessage("GraphQL Config file is not available: ".concat(filepath), "Please check the config filepath."));
    }
    if (result.isEmpty) {
        throw new ConfigEmptyError(composeMessage("GraphQL Config file is empty.", "Please check ".concat(result.filepath)));
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
