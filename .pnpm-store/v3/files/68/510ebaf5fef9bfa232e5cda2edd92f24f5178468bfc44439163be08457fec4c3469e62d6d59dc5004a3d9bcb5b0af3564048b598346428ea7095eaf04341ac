import { __extends } from "tslib";
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
export function composeMessage() {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    return lines.join('\n');
}
var ConfigNotFoundError = /** @class */ (function (_super) {
    __extends(ConfigNotFoundError, _super);
    function ConfigNotFoundError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigNotFoundError;
}(ExtendableBuiltin(Error)));
export { ConfigNotFoundError };
var ConfigEmptyError = /** @class */ (function (_super) {
    __extends(ConfigEmptyError, _super);
    function ConfigEmptyError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigEmptyError;
}(ExtendableBuiltin(Error)));
export { ConfigEmptyError };
var ConfigInvalidError = /** @class */ (function (_super) {
    __extends(ConfigInvalidError, _super);
    function ConfigInvalidError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ConfigInvalidError;
}(ExtendableBuiltin(Error)));
export { ConfigInvalidError };
var ProjectNotFoundError = /** @class */ (function (_super) {
    __extends(ProjectNotFoundError, _super);
    function ProjectNotFoundError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ProjectNotFoundError;
}(ExtendableBuiltin(Error)));
export { ProjectNotFoundError };
var LoadersMissingError = /** @class */ (function (_super) {
    __extends(LoadersMissingError, _super);
    function LoadersMissingError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return LoadersMissingError;
}(ExtendableBuiltin(Error)));
export { LoadersMissingError };
var LoaderNoResultError = /** @class */ (function (_super) {
    __extends(LoaderNoResultError, _super);
    function LoaderNoResultError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return LoaderNoResultError;
}(ExtendableBuiltin(Error)));
export { LoaderNoResultError };
var ExtensionMissingError = /** @class */ (function (_super) {
    __extends(ExtensionMissingError, _super);
    function ExtensionMissingError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        return _this;
    }
    return ExtensionMissingError;
}(ExtendableBuiltin(Error)));
export { ExtensionMissingError };
