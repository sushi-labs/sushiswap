'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_customFunction_CustomFunctionAction = require('./customFunction/CustomFunctionAction.cjs');
var actions_customFunction_RemoteAction = require('./customFunction/RemoteAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/utils/base64Encode.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * Calls a custom function. </br>
 * Learn more: {@link https://cloudinary.com/documentation/custom_functions|Custom functions}
 * @memberOf Actions
 * @namespace CustomFunction
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {remote, wasm} from "@cloudinary/url-gen/actions/customFunction";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.customFunction(
 *  remote('http://example.com')
 * );
 *
 * image.customFunction(
 *  wasm('myPublicID'); // publicID from Cloudinary
 * );
 */
/**
 * @summary action
 * @description - Calls a custom function. </br>
 * For more information about remote custom functions see {@link https://cloudinary.com/documentation/custom_functions#remote_functions|the documentation}
 * @param {string} path - Specifies the URL of the remote custom function.
 * @memberOf Actions.CustomFunction
 * @return {Actions.CustomFunctionAction}
 */
function remote(path) {
    return new actions_customFunction_RemoteAction(path)
        .asRemote();
}
/**
 * @summary action
 * @description - Calls a custom function.  </br>
 * For more information about wasm custom functions see {@link https://cloudinary.com/documentation/custom_functions#webassembly_functions|the documentation}
 * @param {string} publicID - Specifies the publicID of the custom function stored in Cloudinary
 * @memberOf Actions.CustomFunction
 * @return {Actions.CustomFunctionAction}
 */
function wasm(publicID) {
    return new actions_customFunction_CustomFunctionAction(publicID)
        .asWasm();
}
var CustomFunction = { remote: remote, wasm: wasm };

exports.CustomFunction = CustomFunction;
exports.remote = remote;
exports.wasm = wasm;
