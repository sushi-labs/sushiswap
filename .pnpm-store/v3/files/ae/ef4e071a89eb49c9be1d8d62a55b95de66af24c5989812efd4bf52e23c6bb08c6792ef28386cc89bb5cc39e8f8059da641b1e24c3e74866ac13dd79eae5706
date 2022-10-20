'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Skews the image according to the two specified values in degrees.
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
var ShearAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ShearAction, _super);
    function ShearAction(x, y) {
        var _this = _super.call(this) || this;
        _this.skewX(x);
        _this.skewY(y);
        return _this;
    }
    /**
     * @param {number} x Skews the image according to the two specified values in degrees. (X and Y)
     */
    ShearAction.prototype.skewX = function (x) {
        this._x = x;
        return this;
    };
    /**
     * @param {number} y Skews the image according to the two specified values in degrees. (X and Y)
     */
    ShearAction.prototype.skewY = function (y) {
        this._y = y;
        return this;
    };
    ShearAction.prototype.toString = function () {
        return [
            'e_shear',
            this._x,
            this._y
        ].filter(function (a) { return a; }).join(':');
    };
    return ShearAction;
}(internal_Action.Action));

exports.ShearAction = ShearAction;
