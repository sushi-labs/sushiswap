'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_variable_SetAction = require('./variable/SetAction.cjs');
var actions_variable_SetAssetReferenceAction = require('./variable/SetAssetReferenceAction.cjs');
var actions_variable_SetFromContextAction = require('./variable/SetFromContextAction.cjs');
var actions_variable_SetFromMetadataAction = require('./variable/SetFromMetadataAction.cjs');
var internal_utils_toFloatAsString = require('../internal/utils/toFloatAsString.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('./variable/VariableAction.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * Defines a new user variable with the given value.
 * @memberOf Actions
 * @namespace Variable
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {
 *  set,
 *  setAssetReference,
 *  setFromContext,
 *  setFromMetadata
 * } from "@cloudinary/url-gen/actions/variable";
 * import {scale} from "@cloudinary/url-gen/actions/resize";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 *
 * const image = yourCldInstance.image('woman');
 * image
 *  .addVariable(set('foo1', 100))
 *  .addVariable(setAssetReference('foo2', 'val'))
 *  .addVariable(setFromContext('foo3', 'val'))
 *  .addVariable(setFromMetadata('foo4', 'val'))
 *  .resize(scale().width('$foo1').height('$foo2'))
 */
/**
 * @summary action
 * @description Sets a new user variable with the given value.
 * @memberOf Actions.Variable
 * @param {string} name Variable name
 * @param {number | string | number[] | string[]} value Variable value
 * @return {Actions.Variable.SetAction}
 */
function set(name, value) {
    if (Object.prototype.hasOwnProperty.call(value, 'push')) {
        return new actions_variable_SetAction(name, value);
    }
    return new actions_variable_SetAction(name, value);
}
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be a float  setFloat(1) will result in $foo_1.0
 * @memberOf Actions.Variable
 * @param {string} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
function setFloat(name, value) {
    return new actions_variable_SetAction(name, internal_utils_toFloatAsString.toFloatAsString(value), '');
}
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be an integer setInteger(1.1) will result in $foo_1, input is rounded down
 * @memberOf Actions.Variable
 * @param {string} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
function setInteger(name, value) {
    var val = value;
    if (typeof value === 'string') {
        val = parseInt(value);
    }
    if (isNaN(val)) {
        val = 0;
    }
    return new actions_variable_SetAction(name, Math.round(val));
}
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be a string setString(1) will result in $foo_!1!
 * @memberOf Actions.Variable
 * @param {string | number} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
function setString(name, value) {
    return new actions_variable_SetAction(name, value.toString());
}
/**
 * @summary action
 * @description Allows adding a variable by sending a key and value which is a reference to an asset.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetAssetReferenceAction}
 */
function setAssetReference(name, value) {
    return new actions_variable_SetAssetReferenceAction(name, value);
}
/**
 * @summary action
 * @description Allows adding a variable by sending a key and value which is a key to a value that assumed to be on
 * the asset’s context.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetFromContextAction}
 */
function setFromContext(name, value) {
    return new actions_variable_SetFromContextAction(name, value);
}
/**
 * @summary action
 * @description Allows adding a variable by sending a name and value which is a key to a value that assumed to be on
 * the predefined account’s metadata fields.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetFromMetadataAction}
 */
function setFromMetadata(name, value) {
    return new actions_variable_SetFromMetadataAction(name, value);
}
var Variable = {
    set: set,
    setFloat: setFloat,
    setString: setString,
    setInteger: setInteger,
    setAssetReference: setAssetReference,
    setFromContext: setFromContext,
    setFromMetadata: setFromMetadata
};

exports.Variable = Variable;
exports.set = set;
exports.setAssetReference = setAssetReference;
exports.setFloat = setFloat;
exports.setFromContext = setFromContext;
exports.setFromMetadata = setFromMetadata;
exports.setInteger = setInteger;
exports.setString = setString;
