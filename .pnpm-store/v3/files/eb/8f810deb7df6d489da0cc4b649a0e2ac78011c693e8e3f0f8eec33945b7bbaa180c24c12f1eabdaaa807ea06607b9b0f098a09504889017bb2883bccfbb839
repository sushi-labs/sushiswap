'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var qualifiers_blendMode_BlendModeQualifier = require('../../qualifiers/blendMode/BlendModeQualifier.cjs');
var qualifiers_flag_FlagQualifier = require('../../qualifiers/flag/FlagQualifier.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_models_createSourceFromModel = require('../../internal/models/createSourceFromModel.cjs');
var internal_models_createPositionFromModel = require('../../internal/models/createPositionFromModel.cjs');
var internal_models_createTimelinePositionFromModel = require('../../internal/models/createTimelinePositionFromModel.cjs');
var internal_internalConstants = require('../../internal/internalConstants.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/models/IImageSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../../qualifiers/source/BaseSource.cjs');
require('../../internal/models/IFetchSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../../internal/utils/base64Encode.cjs');
require('../../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../../internal/models/ITextSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/TextSource.cjs');
require('../../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../../qualifiers/textStyle.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../../internal/utils/serializeCloudinaryCharacters.cjs');
require('../../qualifiers/textStroke.cjs');
require('../../internal/models/IStrokeModel.cjs');
require('../../internal/utils/prepareColor.cjs');
require('../../internal/models/createTextStyleFromModel.cjs');
require('../../qualifiers/position/PositionQualifier.cjs');
require('../../qualifiers/flag.cjs');
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
require('../../qualifiers/video/TimelinePosition.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @extends SDK.Action
 * @memberOf SDK
 * @description
 * A generic Layer action that can add a Video, Text or Image layer.<br>
 * This class can represent an overlay or an underlay.
 */
var LayerAction = /** @class */ (function (_super) {
    tslib_es6.__extends(LayerAction, _super);
    /**
     * @description Creates a LayerAction to be used with overlays and underlays
     * @param {ImageSource | TextSource | VideoSource} layerSource The Source used for the layer, use the builders provided {@link Qualifiers.Source|here}
     */
    function LayerAction(layerSource) {
        var _this = _super.call(this) || this;
        _this.source = layerSource;
        _this._actionModel = {
            actionType: 'overlay',
            source: layerSource.toJson()
        };
        return _this;
    }
    /**
     * @description Sets the layerType to 'u' (underlay) or 'l' (overlay).
     * @param {'u' | 'l'} type
     * @return {this}
     */
    LayerAction.prototype.setLayerType = function (type) {
        this.layerType = type;
        this._actionModel.actionType = type === 'u' ? 'underlay' : 'overlay';
        return this;
    };
    /**
     * @description Sets the timeline position of the video layer
     * @param {Qualifiers.TimelinePosition} timelinePosition
     * @return {this}
     */
    LayerAction.prototype.timeline = function (timelinePosition) {
        this._timelinePosition = timelinePosition;
        this._actionModel.timelinePosition = timelinePosition.toJson();
        return this;
    };
    /**
     * @description Sets the position of the layer
     * @param {Qualifiers.Position} position
     * @return {this}
     */
    LayerAction.prototype.position = function (position) {
        this._position = position;
        this._actionModel.position = position.toJson();
        return this;
    };
    /**
     * @description Specifies how to blend the image overlay with the base overlay
     * @param {Qualifiers.BlendMode|BlendModeType} blendMode
     * @return {this}
     */
    LayerAction.prototype.blendMode = function (blendMode) {
        this._blendMode = blendMode;
        var _a = ("" + blendMode).replace('e_', '').split(":"), mode = _a[0], level = _a[1];
        if (mode === 'anti_removal') {
            this._actionModel.blendMode = level ? { blendModeType: 'antiRemoval', level: level } : { blendModeType: 'antiRemoval' };
        }
        else {
            this._actionModel.blendMode = { blendModeType: mode };
        }
        return this;
    };
    /**
     * @private
     * @description
     * Closes a layer (layers are built in three stages -> /Open/Transform/Close).
     * @return {SDK.Action}
     */
    LayerAction.prototype.closeLayer = function () {
        var _a, _b, _c, _d;
        var bit = new internal_Action.Action().addFlag(new qualifiers_flag_FlagQualifier.FlagQualifier('layer_apply'));
        (_a = this._position) === null || _a === void 0 ? void 0 : _a.qualifiers.forEach(function (qualifier) {
            bit.addQualifier(qualifier);
        });
        // Flags are stored separately from qualifiers, we need to add those as well
        (_b = this._position) === null || _b === void 0 ? void 0 : _b.flags.forEach(function (flag) {
            bit.addFlag(flag);
        });
        if (typeof this._blendMode === "string") {
            bit.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', this._blendMode));
        }
        else {
            (_c = this._blendMode) === null || _c === void 0 ? void 0 : _c.qualifiers.forEach(function (qualifier) {
                bit.addQualifier(qualifier);
            });
        }
        (_d = this._timelinePosition) === null || _d === void 0 ? void 0 : _d.qualifiers.forEach(function (qualifier) {
            bit.addQualifier(qualifier);
        });
        return bit;
    };
    /**
     * @private
     * @description
     * Opens a layer (layers are built in three stages -> /Open/Transform/Close).
     * @return string
     */
    LayerAction.prototype.openLayer = function () {
        return "" + this.source.getOpenSourceString(this.layerType);
    };
    /**
     * @description
     * Serializes the Layer to a string
     * @return {string}
     */
    LayerAction.prototype.toString = function () {
        return [
            this.openLayer(),
            this.source.getTransformation() && this.source.getTransformation().toString(),
            this.closeLayer()
        ].filter(function (a) { return a; }).join('/');
    };
    LayerAction.fromJson = function (actionModel, transformationFromJson) {
        var _a = actionModel, source = _a.source, actionType = _a.actionType, position = _a.position, timelinePosition = _a.timelinePosition, blendMode = _a.blendMode;
        var sourceInstance = internal_models_createSourceFromModel.createSourceFromModel(source, transformationFromJson);
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(sourceInstance);
        var layerType = actionType === 'overlay' ? 'l' : 'u';
        result.setLayerType(layerType);
        if (position) {
            result.position(internal_models_createPositionFromModel.createPositionFromModel(position));
        }
        if (timelinePosition) {
            result.timeline(internal_models_createTimelinePositionFromModel.createTimelinePositionFromModel(timelinePosition));
        }
        if (blendMode) {
            var blendModeType = internal_internalConstants.ACTION_TYPE_TO_BLEND_MODE_MAP[blendMode.blendModeType] || blendMode.blendModeType;
            if (blendMode === null || blendMode === void 0 ? void 0 : blendMode.level) {
                result.blendMode(new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier(blendModeType, blendMode.level));
            }
            else {
                result.blendMode(new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier(blendModeType));
            }
        }
        return result;
    };
    return LayerAction;
}(internal_Action.Action));

exports.LayerAction = LayerAction;
