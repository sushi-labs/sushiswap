import CustomFunctionAction from "../actions/customFunction/CustomFunctionAction.js";
import { LayerAction } from "../actions/layer/LayerAction.js";
import { Action } from "../internal/Action.js";
import VariableAction from "../actions/variable/VariableAction.js";
import { ConditionalAction } from "../actions/conditional.js";
import { ResizeSimpleAction } from "../actions/resize/ResizeSimpleAction.js";
import RotateAction from "../actions/rotate/RotateAction.js";
import { NamedTransformationAction } from "../actions/namedTransformation/NamedTransformationAction.js";
import { SmartObjectAction } from "../actions/psdTools/SmartObjectAction.js";
import { ClipAction } from "../actions/psdTools/ClipAction.js";
import { GetLayerAction } from "../actions/psdTools/GetLayerAction.js";
import { IReshape } from "../actions/reshape.js";
import { SystemColors } from "../qualifiers/color.js";
import { ExtractAction } from "../actions/extract.js";
import { BorderAction } from "../actions/border.js";
import { FlagQualifier } from "../qualifiers/flag/FlagQualifier.js";
import { EffectActions } from "../actions/effect.js";
import { videoEditType } from "../actions/videoEdit.js";
import { DeliveryAction } from "../actions/delivery/DeliveryAction.js";
import { RawAction } from "../internal/RawAction.js";
import { IAdjustAction } from "../actions/adjust.js";
import { IDeliveryAction } from "../actions/delivery.js";
import { ITranscodeAction } from "../actions/transcode.js";
import { AnimatedAction } from "../actions/animated.js";
import RoundCornersAction from "../actions/roundCorners/RoundCornersAction.js";
import { IErrorObject } from "../internal/models/IErrorObject.js";
import { ITransformationModel } from "../internal/models/ITransformationModel.js";
/**
 * @summary SDK
 * @description - Defines how to transform an asset
 * @memberOf SDK
 */
declare class Transformation {
    actions: (Action | RawAction)[];
    constructor();
    /**
     * @param {SDK.Action | string} action
     * @return {this}
     */
    addAction(action: Action | string): this;
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
    addTransformation(tx: string | Transformation): this;
    /**
     * @return {string}
     */
    toString(): string;
    /**
     * @description Delivers an animated GIF.
     * @param {AnimatedAction} animatedAction
     * @return {this}
     */
    animated(animatedAction: AnimatedAction): this;
    /**
     * @description Adds a border around the image.
     * @param {Border} borderAction
     * @return {this}
     */
    border(borderAction: BorderAction): this;
    /**
     * @description Adjusts the shape of the delivered image. </br>
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_shape_changes_and_distortion_effects|Shape changes and distortion effects}
     * @param {IReshape} reshapeAction
     * @return {this}
     */
    reshape(reshapeAction: IReshape): this;
    /**
     * @description Resize the asset using provided resize action
     * @param {ResizeSimpleAction} resizeAction
     * @return {this}
     */
    resize(resizeAction: ResizeSimpleAction): this;
    /**
     * @param {DeliveryAction} quality
     * @return {this}
     */
    quality(quality: DeliveryAction): this;
    /**
     * @description Rounds the specified corners of an image.
     * @param roundCornersAction
     * @return {this}
     */
    roundCorners(roundCornersAction: RoundCornersAction): this;
    /**
     * @description Adds an overlay over the base image.
     * @param {LayerAction} overlayAction
     * @return {this}
     */
    overlay(overlayAction: LayerAction): this;
    /**
     * @description Adds an underlay under the base image.
     * @param {LayerAction} underlayAction
     * @return {this}
     */
    underlay(underlayAction: LayerAction): this;
    /**
     * @description Defines an new user variable.
     * @param {VariableAction} variableAction
     * @return {this}
     */
    addVariable(variableAction: VariableAction): this;
    /**
     * @description Specifies a condition to be met before applying a transformation.
     * @param {ConditionalAction} conditionAction
     * @return {this}
     */
    conditional(conditionAction: ConditionalAction): this;
    /**
     * @description Applies a filter or an effect on an asset.
     * @param {SimpleEffectAction} effectAction
     * @return {this}
     */
    effect(effectAction: EffectActions): this;
    /**
     * @description Applies adjustment effect on an asset.
     * @param action
     * @return {this}
     */
    adjust(action: IAdjustAction): this;
    /**
     * @description Rotates the asset by the given angle.
     * @param {RotateAction} rotateAction
     * @return {this}
     */
    rotate(rotateAction: RotateAction): this;
    /**
     * @description Applies a pre-defined named transformation of the given name.
     * @param {NamedTransformation} namedTransformation
     * @return {this}
     */
    namedTransformation(namedTransformation: NamedTransformationAction): this;
    /**
     * @description Applies delivery action.
     * @param deliveryAction
     * @return {this}
     */
    delivery(deliveryAction: IDeliveryAction): this;
    /**
     * @description Sets the color of the background.
     * @param {Qualifiers.Color} color
     * @return {this}
     */
    backgroundColor(color: SystemColors): this;
    /**
     * @description Adds a layer in a Photoshop document.
     * @param action
     * @return {this}
     */
    psdTools(action: SmartObjectAction | ClipAction | GetLayerAction): this;
    /**
     * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
     * @param action
     * @return {this}
     */
    extract(action: ExtractAction): this;
    /**
     * @description Adds a flag as a separate action.
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    addFlag(flagQualifier: FlagQualifier | string): this;
    /**
     * @description Inject a custom function into the image transformation pipeline.
     * @return {this}
     */
    customFunction(customFunction: CustomFunctionAction): this;
    /**
     * Transcodes the video (or audio) to another format.
     * @param {Action} action
     * @return {this}
     */
    transcode(action: ITranscodeAction): this;
    /**
     * Applies the specified video edit action.
     *
     * @param {videoEditType} action
     * @return {this}
     */
    videoEdit(action: videoEditType): this;
    toJson(): ITransformationModel | IErrorObject;
}
export { Transformation };
