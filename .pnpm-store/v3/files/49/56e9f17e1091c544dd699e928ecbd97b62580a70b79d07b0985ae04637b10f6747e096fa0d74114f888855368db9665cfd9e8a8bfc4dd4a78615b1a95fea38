'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
require('../flag/FlagQualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description
 * Defines the mode of blending to use when overlaying an image.
 * Even though BlendMode is technically an actionQualifier, it implements exactly the same functionality as an action.
 * This is true because Position is actually compounded of multiple qualifiers
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#overlay_blending_effects|Overlay blending effects}
 *
 * @memberOf Qualifiers.BlendMode
 * @extends SDK.Action
 */
var BlendModeQualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(BlendModeQualifier, _super);
    function BlendModeQualifier(blendMode, level) {
        var _this = _super.call(this) || this;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue([blendMode, level])));
        return _this;
    }
    return BlendModeQualifier;
}(internal_Action.Action));

exports.BlendModeQualifier = BlendModeQualifier;
