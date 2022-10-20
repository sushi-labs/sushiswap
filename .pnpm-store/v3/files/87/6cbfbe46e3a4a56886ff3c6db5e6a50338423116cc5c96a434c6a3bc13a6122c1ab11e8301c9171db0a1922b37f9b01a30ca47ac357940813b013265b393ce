'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var actions_customFunction_CustomFunctionAction = require('./CustomFunctionAction.cjs');
require('../../internal/utils/base64Encode.cjs');
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

var RemoteAction = /** @class */ (function (_super) {
    tslib_es6.__extends(RemoteAction, _super);
    function RemoteAction(fn) {
        /* istanbul ignore next */
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        return _super.call(this, fn) || this;
    }
    RemoteAction.prototype.preprocess = function () {
        this.pre = 'pre';
        return this;
    };
    return RemoteAction;
}(actions_customFunction_CustomFunctionAction));

module.exports = RemoteAction;
