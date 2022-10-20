'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_utils_dataStructureUtils = require('../../internal/utils/dataStructureUtils.cjs');
var actions_variable_VariableAction = require('./VariableAction.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Sets a user-defined variable.
 * @memberOf Actions.Variable
 * @extends Variable.VariableAction
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
var SetAction = /** @class */ (function (_super) {
    tslib_es6.__extends(SetAction, _super);
    function SetAction(name, value, wrapper) {
        if (wrapper === void 0) { wrapper = '!'; }
        var _this = this;
        var finalValue;
        var parsedValue = Array.isArray(value) ? value.join(':') : value;
        if (internal_utils_dataStructureUtils.isString(parsedValue)) {
            /*
             * Encoding needed to make the Variable value Cloudinary Safe
             * If a string, we also determine what wrapper is used (wrapper variable)
             * The wrapper variable is needed because floats are passed as strings ('1.0') - in those case
             * we don't need to treat them as URL strings ($foo_!1.0!), but instead as foo_1.0
             */
            finalValue = "" + wrapper + parsedValue
                .replace(/,/g, '%2C')
                .replace(/\//g, '%2F')
                .replace(/!/g, '%21') + wrapper;
        }
        else {
            finalValue = parsedValue;
        }
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        _this = _super.call(this, name, finalValue) || this;
        return _this;
    }
    return SetAction;
}(actions_variable_VariableAction));

module.exports = SetAction;
