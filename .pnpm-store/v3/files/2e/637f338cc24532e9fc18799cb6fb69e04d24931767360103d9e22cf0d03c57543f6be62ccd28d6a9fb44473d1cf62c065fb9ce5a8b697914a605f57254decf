'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @summary SDK
 * @memberOf SDK
 */
var QualifierValue = /** @class */ (function () {
    /**
     *
     * @param {QualifierValue | QualifierValue[] | any[] | string | number}qualifierValue
     */
    function QualifierValue(qualifierValue) {
        this.values = [];
        this.delimiter = ':'; // {value}{delimiter}{value}...
        if (this.hasValue(qualifierValue)) {
            this.addValue(qualifierValue);
        }
    }
    /**
     * @description Joins the provided values with the provided delimiter
     */
    QualifierValue.prototype.toString = function () {
        return this.values.join(this.delimiter);
    };
    /**
     * @description Checks if the provided argument has a value
     * @param {any} v
     * @private
     * @return {boolean}
     */
    QualifierValue.prototype.hasValue = function (v) {
        return typeof v !== 'undefined' && v !== null && v !== '';
    };
    /**
     * @desc Adds a value for the this qualifier instance
     * @param {any} value
     * @return {this}
     */
    QualifierValue.prototype.addValue = function (value) {
        var _this = this;
        // Append value or array of values
        if (Array.isArray(value)) {
            this.values = this.values.concat(value);
        }
        else {
            this.values.push(value);
        }
        // Remove falsy values
        this.values = this.values.filter(function (v) { return _this.hasValue(v); });
        return this;
    };
    /**
     * @description Sets the delimiter for this instance
     * @param delimiter
     */
    QualifierValue.prototype.setDelimiter = function (delimiter) {
        this.delimiter = delimiter;
        return this;
    };
    return QualifierValue;
}());

exports.QualifierValue = QualifierValue;
