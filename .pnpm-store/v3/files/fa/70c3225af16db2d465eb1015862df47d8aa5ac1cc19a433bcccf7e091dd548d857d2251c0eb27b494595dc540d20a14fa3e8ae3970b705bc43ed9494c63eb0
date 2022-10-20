'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('./QualifierValue.cjs');
var internal_models_QualifierModel = require('../models/QualifierModel.cjs');
require('../models/qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');

/**
 * @summary SDK
 * @memberOf SDK
 */
var Qualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(Qualifier, _super);
    function Qualifier(key, qualifierValue) {
        var _this = _super.call(this) || this;
        _this.delimiter = '_'; // {key}{delimiter}{qualifierValue}
        _this.key = key;
        if (qualifierValue instanceof internal_qualifier_QualifierValue.QualifierValue) {
            _this.qualifierValue = qualifierValue;
        }
        else {
            _this.qualifierValue = new internal_qualifier_QualifierValue.QualifierValue();
            _this.qualifierValue.addValue(qualifierValue);
        }
        return _this;
    }
    Qualifier.prototype.toString = function () {
        var _a = this, key = _a.key, delimiter = _a.delimiter, qualifierValue = _a.qualifierValue;
        return "" + key + delimiter + qualifierValue.toString();
    };
    Qualifier.prototype.addValue = function (value) {
        this.qualifierValue.addValue(value);
        return this;
    };
    return Qualifier;
}(internal_models_QualifierModel.QualifierModel));

exports.Qualifier = Qualifier;
