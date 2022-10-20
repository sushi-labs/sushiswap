import { BorderAction } from "../actions/border.js";
import { IReshape } from "../actions/reshape.js";
import { ResizeSimpleAction } from "../actions/resize/ResizeSimpleAction.js";
import RoundCornersAction from "../actions/roundCorners/RoundCornersAction.js";
import { LayerAction } from "../actions/layer/LayerAction.js";
import VariableAction from "../actions/variable/VariableAction.js";
import { ConditionalAction } from "../actions/conditional.js";
import { Action } from "../internal/Action.js";
import RotateAction from "../actions/rotate/RotateAction.js";
import { NamedTransformationAction } from "../actions/namedTransformation/NamedTransformationAction.js";
import { SystemColors } from "../qualifiers/color.js";
import { ExtractAction } from "../actions/extract.js";
import { SmartObjectAction } from "../actions/psdTools/SmartObjectAction.js";
import { ClipAction } from "../actions/psdTools/ClipAction.js";
import { GetLayerAction } from "../actions/psdTools/GetLayerAction.js";
import { FlagQualifier } from "../qualifiers/flag/FlagQualifier.js";
import CustomFunctionAction from "../actions/customFunction/CustomFunctionAction.js";
import { EffectActions } from "../actions/effect.js";
import { CloudinaryFile } from "./CloudinaryFile.js";
import { Transformation } from "../transformation/Transformation.js";
import IURLConfig from "../config/interfaces/Config/IURLConfig.js";
import ICloudConfig from "../config/interfaces/Config/ICloudConfig.js";
import { IDeliveryAction } from "../actions/delivery.js";
import { IAdjustAction } from "../actions/adjust.js";
import { ITrackedPropertiesThroughAnalytics } from "../sdkAnalytics/interfaces/ITrackedPropertiesThroughAnalytics.js";
import { AnimatedAction } from "../actions/animated.js";
/**
 * @desc Cloudinary Transformable interface, extended by any class that needs a Transformation Interface
 * @summary SDK
 * @memberOf SDK
 */
declare class CloudinaryTransformable extends CloudinaryFile {
    transformation: Transformation;
    constructor(publicID: string, cloudConfig?: ICloudConfig, urlConfig?: IURLConfig, transformation?: Transformation);
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Animated} animated
     * @return {this}
     */
    animated(animated: AnimatedAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Border} border
     * @return {this}
     */
    border(border: BorderAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Reshape} reshape
     * @return {this}
     */
    reshape(reshape: IReshape): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Resize} resize
     * @return {this}
     */
    resize(resize: ResizeSimpleAction): this;
    /**
     * @desc An alias to Action Delivery.quality
     * @param {string|number} quality
     * @return {this}
     */
    quality(quality: string | number): this;
    /**
     * @desc An alias to Action Delivery.format
     * @param {string} format
     * @return {this}
     */
    format(format: string): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.RoundCorners} roundCorners
     * @return {this}
     */
    roundCorners(roundCorners: RoundCornersAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    overlay(overlayAction: LayerAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Variable} variableAction
     * @return {this}
     */
    addVariable(variableAction: VariableAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Condition} conditionalAction
     * @return {this}
     */
    conditional(conditionalAction: ConditionalAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Effect} effect
     * @return {this}
     */
    effect(effect: EffectActions): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Adjust} action
     * @return {this}
     */
    adjust(action: IAdjustAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Rotate} rotate
     * @return {this}
     */
    rotate(rotate: RotateAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.NamedTransformation} namedTransformation
     * @return {this}
     */
    namedTransformation(namedTransformation: NamedTransformationAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Delivery} deliveryAction
     * @return {this}
     */
    delivery(deliveryAction: IDeliveryAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.color} color
     * @return {this}
     */
    backgroundColor(color: SystemColors): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.PSDTools} action
     * @return {this}
     */
    psdTools(action: SmartObjectAction | ClipAction | GetLayerAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Extract} action
     * @return {this}
     */
    extract(action: ExtractAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    addFlag(flagQualifier: FlagQualifier | string): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.CustomFunction} customFunction
     * @return {this}
     */
    customFunction(customFunction: CustomFunctionAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {SDK.Action | string} action
     * @return {this}
     */
    addAction(action: Action | string): this;
    /**
     * @description Extend your transformation with another transformation
     * @param { string | SDK.Transformation } tx
     */
    addTransformation(tx: Transformation | string): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {string}
     */
    toString(): string;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    underlay(underlayAction: LayerAction): this;
    toURL(overwriteOptions?: {
        trackedAnalytics?: Partial<ITrackedPropertiesThroughAnalytics>;
    }): string;
}
export { CloudinaryTransformable };
