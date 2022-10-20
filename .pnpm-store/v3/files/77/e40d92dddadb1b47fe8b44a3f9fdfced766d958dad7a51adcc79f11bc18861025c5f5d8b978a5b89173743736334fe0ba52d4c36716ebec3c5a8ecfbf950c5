'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_region_CustomRegion = require('./region/CustomRegion.cjs');
var qualifiers_region_NamedRegion = require('./region/NamedRegion.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/Action.cjs');
require('./flag/FlagQualifier.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * @summary qualifier
 * @memberOf Qualifiers.Region
 * @return {Qualifiers.Region.CustomRegion}
 */
function custom() {
    return new qualifiers_region_CustomRegion.CustomRegion();
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Region
 * @return {Qualifiers.Region.NamedRegion}
 */
function faces() {
    return new qualifiers_region_NamedRegion.NamedRegion('faces');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Region
 * @return {Qualifiers.Region.NamedRegion}
 */
function ocr() {
    return new qualifiers_region_NamedRegion.NamedRegion('ocr_text');
}
/**
 * @description Contains functions to select the type of region, used with Effect.blur() and Effect.pixelate().
 * <b>See also</b>: {@link Actions.Effect.BlurAction|Blur Action}
 * <b>See also</b>: {@link Actions.Effect.Pixelate|Blur Action}
 * <b>See also</b>: {@link Actions.Effect|Possible effects}
 * @namespace Region
 * @memberOf Qualifiers
 */
var Region = { ocr: ocr, faces: faces, custom: custom };

exports.Region = Region;
exports.custom = custom;
exports.faces = faces;
exports.ocr = ocr;
