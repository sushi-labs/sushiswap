import SetAction from "./variable/SetAction.js";
import SetAssetReferenceAction from "./variable/SetAssetReferenceAction.js";
import SetFromContextAction from "./variable/SetFromContextAction.js";
import SetFromMetadataAction from "./variable/SetFromMetadataAction.js";
import { ExpressionQualifier } from "../qualifiers/expression/ExpressionQualifier.js";
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
declare function set(name: string, value: number | string | number[] | string[] | ExpressionQualifier): SetAction;
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be a float  setFloat(1) will result in $foo_1.0
 * @memberOf Actions.Variable
 * @param {string} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
declare function setFloat(name: string, value: number): SetAction;
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be an integer setInteger(1.1) will result in $foo_1, input is rounded down
 * @memberOf Actions.Variable
 * @param {string} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
declare function setInteger(name: string, value: number): SetAction;
/**
 * @summary action
 * @description Same as 'set', but forces the end value to be a string setString(1) will result in $foo_!1!
 * @memberOf Actions.Variable
 * @param {string | number} name Variable name
 * @param {number} value Variable value
 * @return {Actions.Variable.SetAction}
 */
declare function setString(name: string, value: string | number): SetAction;
/**
 * @summary action
 * @description Allows adding a variable by sending a key and value which is a reference to an asset.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetAssetReferenceAction}
 */
declare function setAssetReference(name: string, value: string): SetAssetReferenceAction;
/**
 * @summary action
 * @description Allows adding a variable by sending a key and value which is a key to a value that assumed to be on
 * the asset’s context.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetFromContextAction}
 */
declare function setFromContext(name: string, value: string): SetFromContextAction;
/**
 * @summary action
 * @description Allows adding a variable by sending a name and value which is a key to a value that assumed to be on
 * the predefined account’s metadata fields.
 * @memberOf Actions.Variable
 * @param {string} name
 * @param {string} value
 * @return {Actions.Variable.SetFromMetadataAction}
 */
declare function setFromMetadata(name: string, value: string): SetFromMetadataAction;
declare const Variable: {
    set: typeof set;
    setFloat: typeof setFloat;
    setString: typeof setString;
    setInteger: typeof setInteger;
    setAssetReference: typeof setAssetReference;
    setFromContext: typeof setFromContext;
    setFromMetadata: typeof setFromMetadata;
};
export { set, setFloat, setString, setInteger, setAssetReference, setFromContext, setFromMetadata, Variable };
