'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_Action = require('../internal/Action.cjs');
var actions_background_actions_BackgroundColor = require('../actions/background/actions/BackgroundColor.cjs');
var internal_utils_prepareColor = require('../internal/utils/prepareColor.cjs');
var qualifiers_flag_FlagQualifier = require('../qualifiers/flag/FlagQualifier.cjs');
var internal_RawAction = require('../internal/RawAction.cjs');
var internal_models_IErrorObject = require('../internal/models/IErrorObject.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * @summary SDK
 * @description - Defines how to transform an asset
 * @memberOf SDK
 */
var Transformation = /** @class */ (function () {
    function Transformation() {
        this.actions = [];
    }
    /**
     * @param {SDK.Action | string} action
     * @return {this}
     */
    Transformation.prototype.addAction = function (action) {
        var actionToAdd;
        if (typeof action === 'string') {
            if (action.indexOf('/') >= 0) {
                throw 'addAction cannot accept a string with a forward slash in it - /, use .addTransformation() instead';
            }
            else {
                actionToAdd = new internal_RawAction.RawAction(action);
            }
        }
        else {
            actionToAdd = action;
        }
        this.actions.push(actionToAdd);
        return this;
    };
    /**
     * @description Allows the injection of a raw transformation as a string into the transformation, or a Transformation instance that was previously created
     * @param {string | SDK.Transformation} tx
     * @example
     * import {Transformation} from "@cloudinary/url-gen";
     *
     * const transformation = new Transformation();
     * transformation.addTransformation('w_100/w_200/w_300');
     * @return {this}
     */
    Transformation.prototype.addTransformation = function (tx) {
        if (tx instanceof Transformation) {
            // Concat the new actions into the existing actions
            this.actions = this.actions.concat(tx.actions);
        }
        else {
            this.actions.push(new internal_RawAction.RawAction(tx));
        }
        return this;
    };
    /**
     * @return {string}
     */
    Transformation.prototype.toString = function () {
        return this.actions
            .map(function (action) {
            return action.toString();
        })
            .filter(function (a) { return a; })
            .join('/');
    };
    /**
     * @description Delivers an animated GIF.
     * @param {AnimatedAction} animatedAction
     * @return {this}
     */
    Transformation.prototype.animated = function (animatedAction) {
        return this.addAction(animatedAction);
    };
    /**
     * @description Adds a border around the image.
     * @param {Border} borderAction
     * @return {this}
     */
    Transformation.prototype.border = function (borderAction) {
        return this.addAction(borderAction);
    };
    /**
     * @description Adjusts the shape of the delivered image. </br>
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_shape_changes_and_distortion_effects|Shape changes and distortion effects}
     * @param {IReshape} reshapeAction
     * @return {this}
     */
    Transformation.prototype.reshape = function (reshapeAction) {
        return this.addAction(reshapeAction);
    };
    /**
     * @description Resize the asset using provided resize action
     * @param {ResizeSimpleAction} resizeAction
     * @return {this}
     */
    Transformation.prototype.resize = function (resizeAction) {
        return this.addAction(resizeAction);
    };
    /**
     * @param {DeliveryAction} quality
     * @return {this}
     */
    Transformation.prototype.quality = function (quality) {
        return this.addAction(quality);
    };
    /**
     * @description Rounds the specified corners of an image.
     * @param roundCornersAction
     * @return {this}
     */
    Transformation.prototype.roundCorners = function (roundCornersAction) {
        return this.addAction(roundCornersAction);
    };
    /**
     * @description Adds an overlay over the base image.
     * @param {LayerAction} overlayAction
     * @return {this}
     */
    Transformation.prototype.overlay = function (overlayAction) {
        return this.addAction(overlayAction);
    };
    /**
     * @description Adds an underlay under the base image.
     * @param {LayerAction} underlayAction
     * @return {this}
     */
    Transformation.prototype.underlay = function (underlayAction) {
        underlayAction.setLayerType('u');
        return this.addAction(underlayAction);
    };
    /**
     * @description Defines an new user variable.
     * @param {VariableAction} variableAction
     * @return {this}
     */
    Transformation.prototype.addVariable = function (variableAction) {
        return this.addAction(variableAction);
    };
    /**
     * @description Specifies a condition to be met before applying a transformation.
     * @param {ConditionalAction} conditionAction
     * @return {this}
     */
    Transformation.prototype.conditional = function (conditionAction) {
        return this.addAction(conditionAction);
    };
    /**
     * @description Applies a filter or an effect on an asset.
     * @param {SimpleEffectAction} effectAction
     * @return {this}
     */
    Transformation.prototype.effect = function (effectAction) {
        return this.addAction(effectAction);
    };
    /**
     * @description Applies adjustment effect on an asset.
     * @param action
     * @return {this}
     */
    Transformation.prototype.adjust = function (action) {
        return this.addAction(action);
    };
    /**
     * @description Rotates the asset by the given angle.
     * @param {RotateAction} rotateAction
     * @return {this}
     */
    Transformation.prototype.rotate = function (rotateAction) {
        return this.addAction(rotateAction);
    };
    /**
     * @description Applies a pre-defined named transformation of the given name.
     * @param {NamedTransformation} namedTransformation
     * @return {this}
     */
    Transformation.prototype.namedTransformation = function (namedTransformation) {
        return this.addAction(namedTransformation);
    };
    /**
     * @description Applies delivery action.
     * @param deliveryAction
     * @return {this}
     */
    Transformation.prototype.delivery = function (deliveryAction) {
        return this.addAction(deliveryAction);
    };
    /**
     * @description Sets the color of the background.
     * @param {Qualifiers.Color} color
     * @return {this}
     */
    Transformation.prototype.backgroundColor = function (color) {
        return this.addAction(new actions_background_actions_BackgroundColor.BackgroundColor(internal_utils_prepareColor.prepareColor(color)));
    };
    /**
     * @description Adds a layer in a Photoshop document.
     * @param action
     * @return {this}
     */
    Transformation.prototype.psdTools = function (action) {
        return this.addAction(action);
    };
    /**
     * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
     * @param action
     * @return {this}
     */
    Transformation.prototype.extract = function (action) {
        return this.addAction(action);
    };
    /**
     * @description Adds a flag as a separate action.
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    Transformation.prototype.addFlag = function (flagQualifier) {
        var action = new internal_Action.Action();
        var flagToAdd = flagQualifier;
        if (typeof flagQualifier === 'string') {
            flagToAdd = new qualifiers_flag_FlagQualifier.FlagQualifier(flagQualifier);
        }
        action.addQualifier(flagToAdd);
        return this.addAction(action);
    };
    /**
     * @description Inject a custom function into the image transformation pipeline.
     * @return {this}
     */
    Transformation.prototype.customFunction = function (customFunction) {
        return this.addAction(customFunction);
    };
    /**
     * Transcodes the video (or audio) to another format.
     * @param {Action} action
     * @return {this}
     */
    Transformation.prototype.transcode = function (action) {
        return this.addAction(action);
    };
    /**
     * Applies the specified video edit action.
     *
     * @param {videoEditType} action
     * @return {this}
     */
    Transformation.prototype.videoEdit = function (action) {
        return this.addAction(action);
    };
    Transformation.prototype.toJson = function () {
        var actions = [];
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            var json = action.toJson();
            if (internal_models_IErrorObject.isErrorObject(json)) {
                // Fail early and return an IErrorObject
                return json;
            }
            actions.push(json);
        }
        return { actions: actions };
    };
    return Transformation;
}());

exports.Transformation = Transformation;
