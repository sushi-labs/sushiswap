'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_namedTransformation_NamedTransformationAction = require('./namedTransformation/NamedTransformationAction.cjs');
require('../tslib.es6-f1398b83.cjs');
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
 * Applies a pre-defined named transformation of the given name.
 * @memberOf Actions
 * @namespace NamedTransformation
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {name} from "@cloudinary/url-gen/actions/namedTransformation";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.namedTransformation(
 *  name('my_named_transformation'),
 * );
 */
/**
 * @summary action
 * @description Applies a pre-defined named transformation of the given name.
 * @param {string} name Transformation name
 * @memberOf Actions.NamedTransformation
 * @return {Actions.NamedTransformation.NamedTransformationAction}
 */
function name(name) {
    return new actions_namedTransformation_NamedTransformationAction.NamedTransformationAction(name);
}
var NamedTransformation = { name: name };

exports.NamedTransformation = NamedTransformation;
exports.name = name;
