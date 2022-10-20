'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var assets_CloudinaryFile = require('./CloudinaryFile.cjs');
var actions_delivery_DeliveryFormatAction = require('../actions/delivery/DeliveryFormatAction.cjs');
require('../internal/url/cloudinaryURL.cjs');
require('../internal/url/urlUtils/isUrl.cjs');
require('../internal/url/urlUtils/isFileName.cjs');
require('../internal/url/urlUtils/publicIDContainsVersion.cjs');
require('../config/URLConfig.cjs');
require('../config/BaseConfig.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../sdkAnalytics/getSDKAnalyticsSignature.cjs');
require('../sdkAnalytics/encodeVersion.cjs');
require('../sdkAnalytics/base64Map.cjs');
require('../sdkAnalytics/stringPad.cjs');
require('../sdkAnalytics/reverseVersion.cjs');
require('../sdkAnalytics/getAnalyticsOptions.cjs');
require('../internal/utils/packageVersion.cjs');
require('../qualifiers/flag.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../actions/delivery/DeliveryAction.cjs');
require('../internal/Action.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/progressive.cjs');

/**
 * @desc Cloudinary Transformable interface, extended by any class that needs a Transformation Interface
 * @summary SDK
 * @memberOf SDK
 */
var CloudinaryTransformable = /** @class */ (function (_super) {
    tslib_es6.__extends(CloudinaryTransformable, _super);
    function CloudinaryTransformable(publicID, cloudConfig, urlConfig, transformation) {
        var _this = 
        /* istanbul ignore next */
        _super.call(this, publicID, cloudConfig, urlConfig) || this;
        _this.transformation = transformation;
        return _this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Animated} animated
     * @return {this}
     */
    CloudinaryTransformable.prototype.animated = function (animated) {
        this.transformation.animated(animated);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Border} border
     * @return {this}
     */
    CloudinaryTransformable.prototype.border = function (border) {
        this.transformation.border(border);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Reshape} reshape
     * @return {this}
     */
    CloudinaryTransformable.prototype.reshape = function (reshape) {
        this.transformation.reshape(reshape);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Resize} resize
     * @return {this}
     */
    CloudinaryTransformable.prototype.resize = function (resize) {
        this.transformation.resize(resize);
        return this;
    };
    /**
     * @desc An alias to Action Delivery.quality
     * @param {string|number} quality
     * @return {this}
     */
    CloudinaryTransformable.prototype.quality = function (quality) {
        this.addAction(new actions_delivery_DeliveryFormatAction.DeliveryFormatAction('q', quality));
        return this;
    };
    /**
     * @desc An alias to Action Delivery.format
     * @param {string} format
     * @return {this}
     */
    CloudinaryTransformable.prototype.format = function (format) {
        this.addAction(new actions_delivery_DeliveryFormatAction.DeliveryFormatAction('f', format));
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.RoundCorners} roundCorners
     * @return {this}
     */
    CloudinaryTransformable.prototype.roundCorners = function (roundCorners) {
        this.transformation.roundCorners(roundCorners);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    CloudinaryTransformable.prototype.overlay = function (overlayAction) {
        this.transformation.overlay(overlayAction);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Variable} variableAction
     * @return {this}
     */
    CloudinaryTransformable.prototype.addVariable = function (variableAction) {
        this.transformation.addVariable(variableAction);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Condition} conditionalAction
     * @return {this}
     */
    CloudinaryTransformable.prototype.conditional = function (conditionalAction) {
        this.transformation.conditional(conditionalAction);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Effect} effect
     * @return {this}
     */
    CloudinaryTransformable.prototype.effect = function (effect) {
        this.transformation.effect(effect);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Adjust} action
     * @return {this}
     */
    CloudinaryTransformable.prototype.adjust = function (action) {
        this.transformation.adjust(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Rotate} rotate
     * @return {this}
     */
    CloudinaryTransformable.prototype.rotate = function (rotate) {
        this.transformation.rotate(rotate);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.NamedTransformation} namedTransformation
     * @return {this}
     */
    CloudinaryTransformable.prototype.namedTransformation = function (namedTransformation) {
        this.transformation.namedTransformation(namedTransformation);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Delivery} deliveryAction
     * @return {this}
     */
    CloudinaryTransformable.prototype.delivery = function (deliveryAction) {
        this.transformation.delivery(deliveryAction);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.color} color
     * @return {this}
     */
    CloudinaryTransformable.prototype.backgroundColor = function (color) {
        this.transformation.backgroundColor(color);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.PSDTools} action
     * @return {this}
     */
    CloudinaryTransformable.prototype.psdTools = function (action) {
        this.transformation.psdTools(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Extract} action
     * @return {this}
     */
    CloudinaryTransformable.prototype.extract = function (action) {
        this.transformation.extract(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    CloudinaryTransformable.prototype.addFlag = function (flagQualifier) {
        this.transformation.addFlag(flagQualifier);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.CustomFunction} customFunction
     * @return {this}
     */
    CloudinaryTransformable.prototype.customFunction = function (customFunction) {
        this.transformation.customFunction(customFunction);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {SDK.Action | string} action
     * @return {this}
     */
    CloudinaryTransformable.prototype.addAction = function (action) {
        this.transformation.addAction(action);
        return this;
    };
    /**
     * @description Extend your transformation with another transformation
     * @param { string | SDK.Transformation } tx
     */
    CloudinaryTransformable.prototype.addTransformation = function (tx) {
        this.transformation.addTransformation(tx);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {string}
     */
    CloudinaryTransformable.prototype.toString = function () {
        return this.transformation.toString();
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    CloudinaryTransformable.prototype.underlay = function (underlayAction) {
        this.transformation.underlay(underlayAction);
        return this;
    };
    CloudinaryTransformable.prototype.toURL = function (overwriteOptions) {
        if (overwriteOptions === void 0) { overwriteOptions = {}; }
        return this.createCloudinaryURL(this.transformation, overwriteOptions === null || overwriteOptions === void 0 ? void 0 : overwriteOptions.trackedAnalytics);
    };
    return CloudinaryTransformable;
}(assets_CloudinaryFile.CloudinaryFile));

exports.CloudinaryTransformable = CloudinaryTransformable;
