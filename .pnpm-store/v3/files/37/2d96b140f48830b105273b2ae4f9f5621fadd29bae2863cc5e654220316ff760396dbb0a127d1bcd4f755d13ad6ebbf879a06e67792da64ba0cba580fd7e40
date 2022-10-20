'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Distorts the image to a new shape by adjusting its corners to achieve perception warping.
 * Specify four corner coordinates, representing the new coordinates for each of the image's four corners,
 * in clockwise order from the top-left corner.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#e_distort|Distorting images}
 * @param {number[]} coordinates - Four x/y pairs representing the new image corners
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
var DistortAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DistortAction, _super);
    function DistortAction(coordinates) {
        var _this = _super.call(this) || this;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "distort:" + coordinates.join(':')));
        return _this;
    }
    return DistortAction;
}(internal_Action.Action));

exports.DistortAction = DistortAction;
