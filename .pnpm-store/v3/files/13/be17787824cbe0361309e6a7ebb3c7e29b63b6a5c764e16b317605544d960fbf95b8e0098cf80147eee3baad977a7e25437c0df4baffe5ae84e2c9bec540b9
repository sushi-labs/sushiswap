'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../internal/qualifier/QualifierValue.cjs');

/**
 * @summary qualifier
 * @namespace AutoFocus
 * @memberOf Qualifiers
 * @see Visit {@link Qualifiers.Gravity|Gravity} for an example
 */
/**
 * @memberOf Qualifiers.AutoFocus
 * @extends {SDK.QualifierValue}
 * @see Visit {@link Qualifiers.Gravity|Gravity} for an example
 */
var AutoFocus = /** @class */ (function (_super) {
    tslib_es6.__extends(AutoFocus, _super);
    function AutoFocus(focusOn, weight) {
        var _this = _super.call(this) || this;
        _this._weight = weight;
        _this.focusOn = focusOn;
        _this.shouldAvoid = false;
        return _this;
    }
    /**
     * @summary qualifier
     * @description Specifies the object to focus on automatically
     * Accepts an AutoFocusObject (which is just a wrapper for a FocusOn object, but with extra method: avoid, weight)
     * @param {Qualifiers.FocusOn} obj The object to focus on.
     * @param {number} weight
     */
    AutoFocus.focusOn = function (obj, weight) {
        return new AutoFocus(obj, weight);
    };
    AutoFocus.prototype.shouldAddWeight = function () {
        return typeof this._weight === 'number' || typeof this._weight === 'string' || this.shouldAvoid;
    };
    /**
     * @summary qualifier
     * @desc Get the name of the of the object
     */
    AutoFocus.prototype.getName = function () {
        return this.focusOn.name;
    };
    /**
     * @summary qualifier
     * @desc Get the weight for the object
     */
    AutoFocus.prototype.getWeight = function () {
        if (this.shouldAvoid) {
            return 'avoid';
        }
        else {
            return this._weight;
        }
    };
    /**
     * @summary qualifier
     * @desc Return the string representation of this QualifierValue
     */
    AutoFocus.prototype.toString = function () {
        // Future proofing, in case we'd like to support some custom string in the future, or if data is coming from a DB
        if (this.shouldAddWeight()) {
            return this.getName() + "_" + this.getWeight();
        }
        else {
            return "" + this.getName();
        }
    };
    /**
     * @summary qualifier
     * @description Sets the importance level of the object within the automatic gravity algorithm
     * @param {numebr} w The focus weight for the object
     * @return {this}
     */
    AutoFocus.prototype.weight = function (w) {
        this._weight = w;
        return this;
    };
    /**
     * @summary qualifier
     * @description Attempts to avoid the detected object in the image
     * @return {this}
     */
    AutoFocus.prototype.avoid = function () {
        this.shouldAvoid = true;
        return this;
    };
    return AutoFocus;
}(internal_qualifier_QualifierValue.QualifierValue));

exports.AutoFocus = AutoFocus;
