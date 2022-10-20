'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var qualifiers_flag_FlagQualifier = require('../qualifiers/flag/FlagQualifier.cjs');
var internal_qualifier_Qualifier = require('./qualifier/Qualifier.cjs');
var internal_utils_dataStructureUtils = require('./utils/dataStructureUtils.cjs');
var internal_models_ActionModel = require('./models/ActionModel.cjs');
require('./qualifier/QualifierValue.cjs');
require('./models/QualifierModel.cjs');
require('./models/qualifierToJson.cjs');
require('./utils/unsupportedError.cjs');
require('./models/actionToJson.cjs');

/**
 * @summary SDK
 * @memberOf SDK
 * @description Defines the category of transformation to perform.
 */
var Action = /** @class */ (function (_super) {
    tslib_es6.__extends(Action, _super);
    function Action() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // We're using map, to overwrite existing keys. for example:
        // addParam(w_100).addQualifier(w_200) should result in w_200. and not w_100,w_200
        _this.qualifiers = new Map();
        // Unlike regular qualifiers, there can be multiple flags in each url component /fl_1,fl_2/
        // If the falgs are added to the qualifiers map, only a single flag could exist in a component (it's a map)
        // So flags are stored separately until the very end because of that reason
        _this.flags = [];
        _this.delimiter = ','; // {qualifier}{delimiter}{qualifier} for example: `${'w_100'}${','}${'c_fill'}`
        _this.actionTag = ''; // A custom name tag to identify this action in the future
        return _this;
    }
    Action.prototype.prepareQualifiers = function () { };
    /**
     * @description Returns the custom name tag that was given to this action
     * @return {string}
     */
    Action.prototype.getActionTag = function () {
        return this.actionTag;
    };
    /**
     * @description Sets the custom name tag for this action
     * @return {this}
     */
    Action.prototype.setActionTag = function (tag) {
        this.actionTag = tag;
        return this;
    };
    /**
     * @description Calls toString() on all child qualifiers (implicitly by using .join()).
     * @return {string}
     */
    Action.prototype.toString = function () {
        this.prepareQualifiers();
        return internal_utils_dataStructureUtils.mapToSortedArray(this.qualifiers, this.flags).join(this.delimiter);
    };
    /**
     * @description Adds the parameter to the action.
     * @param {SDK.Qualifier} qualifier
     * @return {this}
     */
    Action.prototype.addQualifier = function (qualifier) {
        // if string, find the key and value
        if (typeof qualifier === 'string') {
            var _a = qualifier.toLowerCase().split('_'), key = _a[0], value = _a[1];
            if (key === 'fl') {
                // if string qualifier is a flag, store it in the flags arrays
                this.flags.push(new qualifiers_flag_FlagQualifier.FlagQualifier(value));
            }
            else {
                // if the string qualifier is not a flag, create a new qualifier from it
                this.qualifiers.set(key, new internal_qualifier_Qualifier.Qualifier(key, value));
            }
        }
        else {
            // if a qualifier object, insert to the qualifiers map
            this.qualifiers.set(qualifier.key, qualifier);
        }
        return this;
    };
    /**
     * @description Adds a flag to the current action.
     * @param {Qualifiers.Flag} flag
     * @return {this}
     */
    Action.prototype.addFlag = function (flag) {
        if (typeof flag === 'string') {
            this.flags.push(new qualifiers_flag_FlagQualifier.FlagQualifier(flag));
        }
        else {
            if (flag instanceof qualifiers_flag_FlagQualifier.FlagQualifier) {
                this.flags.push(flag);
            }
        }
        return this;
    };
    Action.prototype.addValueToQualifier = function (qualifierKey, qualifierValue) {
        this.qualifiers.get(qualifierKey).addValue(qualifierValue);
        return this;
    };
    return Action;
}(internal_models_ActionModel.ActionModel));

exports.Action = Action;
