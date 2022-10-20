'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');

/**
 * @memberOf Qualifiers.Flag
 * @extends {SDK.Qualifier}
 * @description the FlagQualifier class
 */
var FlagQualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(FlagQualifier, _super);
    function FlagQualifier(flagType, flagValue) {
        var _this = this;
        var qualifierValue;
        if (flagValue) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue([flagType, "" + flagValue]).setDelimiter(':');
        }
        else {
            qualifierValue = flagType;
        }
        _this = _super.call(this, 'fl', qualifierValue) || this;
        _this.flagValue = flagValue;
        return _this;
    }
    FlagQualifier.prototype.toString = function () {
        return _super.prototype.toString.call(this).replace(/\./, '%2E');
    };
    FlagQualifier.prototype.getFlagValue = function () {
        return this.flagValue;
    };
    return FlagQualifier;
}(internal_qualifier_Qualifier.Qualifier));

exports.FlagQualifier = FlagQualifier;
