"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionMissingError = exports.LoaderNoResultError = exports.LoadersMissingError = exports.ProjectNotFoundError = exports.ConfigInvalidError = exports.ConfigEmptyError = exports.ConfigNotFoundError = exports.composeMessage = void 0;
var tslib_1 = require("tslib");
// eslint-disable-next-line @typescript-eslint/ban-types -- TODO: fix lint error
function ExtendableBuiltin(cls) {
    function ExtendableBuiltin() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cls.apply(this, args);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);
    return ExtendableBuiltin;
}
function composeMessage() {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    return lines.join('\n');
}
exports.composeMessage = composeMessage;
var ConfigNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigNotFoundError, _super);
    function ConfigNotFoundError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigNotFoundError;
}(ExtendableBuiltin(Error)));
exports.ConfigNotFoundError = ConfigNotFoundError;
var ConfigEmptyError = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigEmptyError, _super);
    function ConfigEmptyError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigEmptyError;
}(ExtendableBuiltin(Error)));
exports.ConfigEmptyError = ConfigEmptyError;
var ConfigInvalidError = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigInvalidError, _super);
    function ConfigInvalidError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigInvalidError;
}(ExtendableBuiltin(Error)));
exports.ConfigInvalidError = ConfigInvalidError;
var ProjectNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(ProjectNotFoundError, _super);
    function ProjectNotFoundError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ProjectNotFoundError;
}(ExtendableBuiltin(Error)));
exports.ProjectNotFoundError = ProjectNotFoundError;
var LoadersMissingError = /** @class */ (function (_super) {
    tslib_1.__extends(LoadersMissingError, _super);
    function LoadersMissingError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return LoadersMissingError;
}(ExtendableBuiltin(Error)));
exports.LoadersMissingError = LoadersMissingError;
var LoaderNoResultError = /** @class */ (function (_super) {
    tslib_1.__extends(LoaderNoResultError, _super);
    function LoaderNoResultError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return LoaderNoResultError;
}(ExtendableBuiltin(Error)));
exports.LoaderNoResultError = LoaderNoResultError;
var ExtensionMissingError = /** @class */ (function (_super) {
    tslib_1.__extends(ExtensionMissingError, _super);
    function ExtensionMissingError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ExtensionMissingError;
}(ExtendableBuiltin(Error)));
exports.ExtensionMissingError = ExtensionMissingError;
