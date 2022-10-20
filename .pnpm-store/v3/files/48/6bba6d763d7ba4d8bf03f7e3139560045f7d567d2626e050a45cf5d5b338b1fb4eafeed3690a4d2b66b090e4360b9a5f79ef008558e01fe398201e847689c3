'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var actions_variable_VariableAction = require('./VariableAction.cjs');
require('../../internal/Action.cjs');
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
 * @description Sets a user-defined variable from a file reference.
 * @memberOf Actions.Variable
 * @extends {Variable.VariableAction}
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
var SetAssetReferenceAction = /** @class */ (function (_super) {
    tslib_es6.__extends(SetAssetReferenceAction, _super);
    function SetAssetReferenceAction(name, value) {
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        var _this = this;
        var parsedValue = value
            .replace(/\//g, ':');
        _this = _super.call(this, name, "ref:!" + parsedValue + "!") || this;
        return _this;
    }
    return SetAssetReferenceAction;
}(actions_variable_VariableAction));

module.exports = SetAssetReferenceAction;
