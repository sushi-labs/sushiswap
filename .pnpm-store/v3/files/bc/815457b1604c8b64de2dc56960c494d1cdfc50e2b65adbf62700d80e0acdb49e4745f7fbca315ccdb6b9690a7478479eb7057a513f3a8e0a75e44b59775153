'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Defines an new user variable.
 * @memberOf Actions.Variable
 * @extends SDK.Action
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
var VariableAction = /** @class */ (function (_super) {
    tslib_es6.__extends(VariableAction, _super);
    function VariableAction(name, value) {
        var _this = _super.call(this) || this;
        _this.isFloat = false;
        _this.isNumber = false;
        _this.value = value;
        _this.name = name;
        return _this;
    }
    /**
     * @description Converts the returned value to type float.
     */
    VariableAction.prototype.asFloat = function () {
        this.isFloat = true;
        return this;
    };
    /**
     * @description Converts the returned value to type number.
     */
    VariableAction.prototype.asInteger = function () {
        this.isNumber = true;
        return this;
    };
    VariableAction.prototype.prepareQualifiers = function () {
        var qualifierValue;
        if (this.isFloat) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue([this.value, 'to_f']).setDelimiter('_');
        }
        else if (this.isNumber) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue([this.value, 'to_i']).setDelimiter('_');
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(this.value);
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier("$" + this.name, qualifierValue));
        return this;
    };
    return VariableAction;
}(internal_Action.Action));

module.exports = VariableAction;
