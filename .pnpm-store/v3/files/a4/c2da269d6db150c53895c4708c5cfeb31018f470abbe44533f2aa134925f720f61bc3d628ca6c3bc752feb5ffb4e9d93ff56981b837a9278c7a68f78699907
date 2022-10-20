'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var actions_resize_ResizeAdvancedAction = require('./ResizeAdvancedAction.cjs');
var internal_models_createBackgroundModel = require('../../internal/models/createBackgroundModel.cjs');
var internal_models_createBackgroundFromModel = require('../../internal/models/createBackgroundFromModel.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('./ResizeSimpleAction.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/toFloatAsString.cjs');
require('../../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../../qualifiers/flag.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');
require('../../internal/models/createGravityModel.cjs');
require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../../qualifiers/gravity.cjs');
require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../../internal/models/createGravityFromModel.cjs');
require('../../qualifiers/focusOn.cjs');
require('../../qualifiers/autoFocus.cjs');
require('../../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');
require('../../qualifiers/background/shared/BlurredBackgroundAction.cjs');
require('../../qualifiers/background/shared/base/BackgroundQualifier.cjs');
require('../../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.cjs');
require('../../qualifiers/background/shared/base/BaseCommonBackground.cjs');
require('../../internal/utils/prepareColor.cjs');
require('../../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
require('../../qualifiers/background/shared/base/BaseGradientBackground.cjs');
require('../../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
require('../../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
require('../../qualifiers/rotate/RotationModeQualifierValue.cjs');
require('../../qualifiers/region/CustomRegion.cjs');
require('../../qualifiers/region/NamedRegion.cjs');
require('../../qualifiers/position/PositionQualifier.cjs');
require('../../qualifiers/gradientDirection/GradientDirectionQualifierValue.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../../qualifiers/expression/ExpressionQualifier.cjs');
require('../../qualifiers/background.cjs');
require('../../qualifiers/animatedFormat/AnimatedFormatQualifierValue.cjs');
require('../../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../../qualifiers/source/BaseSource.cjs');
require('../../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../../qualifiers/source/sourceTypes/SubtitlesSource.cjs');
require('../../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../../qualifiers/textStyle.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../../internal/utils/serializeCloudinaryCharacters.cjs');
require('../../qualifiers/textStroke.cjs');
require('../../internal/models/IStrokeModel.cjs');
require('../../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../../internal/utils/base64Encode.cjs');
require('../../qualifiers/source/sourceTypes/TextSource.cjs');
require('../../internal/models/createTextStyleFromModel.cjs');

/**
 * @description Defines an advanced resize with padding.
 * @extends Actions.Resize.ResizeAdvancedAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
var ResizePadAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ResizePadAction, _super);
    function ResizePadAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Sets the background.
     * @param {Qualifiers.Background} backgroundQualifier Defines the background color to use instead of
     * transparent background areas or when resizing with padding.
     */
    ResizePadAction.prototype.background = function (backgroundQualifier) {
        this._actionModel.background = internal_models_createBackgroundModel.createBackgroundModel(backgroundQualifier);
        return this.addQualifier(backgroundQualifier);
    };
    /**
     * @description Horizontal position for custom-coordinates based padding.
     * @param {number} x The x position.
     */
    ResizePadAction.prototype.offsetX = function (x) {
        this._actionModel.x = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', x));
    };
    /**
     * @description Vertical position for custom-coordinates based padding
     * @param {number} y The y position.
     */
    ResizePadAction.prototype.offsetY = function (y) {
        this._actionModel.y = y;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', y));
    };
    ResizePadAction.fromJson = function (actionModel) {
        var result = _super.fromJson.apply(this, [actionModel]);
        actionModel.background && result.background(internal_models_createBackgroundFromModel.createBackgroundFromModel(actionModel.background));
        actionModel.x && result.offsetX(actionModel.x);
        actionModel.y && result.offsetY(actionModel.y);
        actionModel.zoom && result.zoom(actionModel.zoom);
        return result;
    };
    return ResizePadAction;
}(actions_resize_ResizeAdvancedAction.ResizeAdvancedAction));

exports.ResizePadAction = ResizePadAction;
