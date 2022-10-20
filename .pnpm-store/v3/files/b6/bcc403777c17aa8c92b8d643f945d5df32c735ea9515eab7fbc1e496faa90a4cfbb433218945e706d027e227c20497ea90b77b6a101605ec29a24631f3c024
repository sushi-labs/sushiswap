import { CloudinaryFile } from "./CloudinaryFile.js";
import { DeliveryFormatAction } from "../actions/delivery/DeliveryFormatAction.js";
/**
 * @desc Cloudinary Transformable interface, extended by any class that needs a Transformation Interface
 * @summary SDK
 * @memberOf SDK
 */
class CloudinaryTransformable extends CloudinaryFile {
    constructor(publicID, cloudConfig, urlConfig, transformation) {
        /* istanbul ignore next */
        super(publicID, cloudConfig, urlConfig);
        this.transformation = transformation;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Animated} animated
     * @return {this}
     */
    animated(animated) {
        this.transformation.animated(animated);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Border} border
     * @return {this}
     */
    border(border) {
        this.transformation.border(border);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Reshape} reshape
     * @return {this}
     */
    reshape(reshape) {
        this.transformation.reshape(reshape);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Resize} resize
     * @return {this}
     */
    resize(resize) {
        this.transformation.resize(resize);
        return this;
    }
    /**
     * @desc An alias to Action Delivery.quality
     * @param {string|number} quality
     * @return {this}
     */
    quality(quality) {
        this.addAction(new DeliveryFormatAction('q', quality));
        return this;
    }
    /**
     * @desc An alias to Action Delivery.format
     * @param {string} format
     * @return {this}
     */
    format(format) {
        this.addAction(new DeliveryFormatAction('f', format));
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.RoundCorners} roundCorners
     * @return {this}
     */
    roundCorners(roundCorners) {
        this.transformation.roundCorners(roundCorners);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    overlay(overlayAction) {
        this.transformation.overlay(overlayAction);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Variable} variableAction
     * @return {this}
     */
    addVariable(variableAction) {
        this.transformation.addVariable(variableAction);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Condition} conditionalAction
     * @return {this}
     */
    conditional(conditionalAction) {
        this.transformation.conditional(conditionalAction);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Effect} effect
     * @return {this}
     */
    effect(effect) {
        this.transformation.effect(effect);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Adjust} action
     * @return {this}
     */
    adjust(action) {
        this.transformation.adjust(action);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Rotate} rotate
     * @return {this}
     */
    rotate(rotate) {
        this.transformation.rotate(rotate);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.NamedTransformation} namedTransformation
     * @return {this}
     */
    namedTransformation(namedTransformation) {
        this.transformation.namedTransformation(namedTransformation);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Delivery} deliveryAction
     * @return {this}
     */
    delivery(deliveryAction) {
        this.transformation.delivery(deliveryAction);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.color} color
     * @return {this}
     */
    backgroundColor(color) {
        this.transformation.backgroundColor(color);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.PSDTools} action
     * @return {this}
     */
    psdTools(action) {
        this.transformation.psdTools(action);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Extract} action
     * @return {this}
     */
    extract(action) {
        this.transformation.extract(action);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    addFlag(flagQualifier) {
        this.transformation.addFlag(flagQualifier);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.CustomFunction} customFunction
     * @return {this}
     */
    customFunction(customFunction) {
        this.transformation.customFunction(customFunction);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {SDK.Action | string} action
     * @return {this}
     */
    addAction(action) {
        this.transformation.addAction(action);
        return this;
    }
    /**
     * @description Extend your transformation with another transformation
     * @param { string | SDK.Transformation } tx
     */
    addTransformation(tx) {
        this.transformation.addTransformation(tx);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {string}
     */
    toString() {
        return this.transformation.toString();
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    underlay(underlayAction) {
        this.transformation.underlay(underlayAction);
        return this;
    }
    toURL(overwriteOptions = {}) {
        return this.createCloudinaryURL(this.transformation, overwriteOptions === null || overwriteOptions === void 0 ? void 0 : overwriteOptions.trackedAnalytics);
    }
}
export { CloudinaryTransformable };
