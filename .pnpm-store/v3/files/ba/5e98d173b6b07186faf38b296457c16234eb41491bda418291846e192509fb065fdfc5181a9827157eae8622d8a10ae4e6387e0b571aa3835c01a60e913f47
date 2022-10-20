import { Action } from "../internal/Action.js";
import { BackgroundColor } from "../actions/background/actions/BackgroundColor.js";
import { prepareColor } from "../internal/utils/prepareColor.js";
import { FlagQualifier } from "../qualifiers/flag/FlagQualifier.js";
import { RawAction } from "../internal/RawAction.js";
import { isErrorObject } from "../internal/models/IErrorObject.js";
/**
 * @summary SDK
 * @description - Defines how to transform an asset
 * @memberOf SDK
 */
class Transformation {
    constructor() {
        this.actions = [];
    }
    /**
     * @param {SDK.Action | string} action
     * @return {this}
     */
    addAction(action) {
        let actionToAdd;
        if (typeof action === 'string') {
            if (action.indexOf('/') >= 0) {
                throw 'addAction cannot accept a string with a forward slash in it - /, use .addTransformation() instead';
            }
            else {
                actionToAdd = new RawAction(action);
            }
        }
        else {
            actionToAdd = action;
        }
        this.actions.push(actionToAdd);
        return this;
    }
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
    addTransformation(tx) {
        if (tx instanceof Transformation) {
            // Concat the new actions into the existing actions
            this.actions = this.actions.concat(tx.actions);
        }
        else {
            this.actions.push(new RawAction(tx));
        }
        return this;
    }
    /**
     * @return {string}
     */
    toString() {
        return this.actions
            .map((action) => {
            return action.toString();
        })
            .filter((a) => a)
            .join('/');
    }
    /**
     * @description Delivers an animated GIF.
     * @param {AnimatedAction} animatedAction
     * @return {this}
     */
    animated(animatedAction) {
        return this.addAction(animatedAction);
    }
    /**
     * @description Adds a border around the image.
     * @param {Border} borderAction
     * @return {this}
     */
    border(borderAction) {
        return this.addAction(borderAction);
    }
    /**
     * @description Adjusts the shape of the delivered image. </br>
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_shape_changes_and_distortion_effects|Shape changes and distortion effects}
     * @param {IReshape} reshapeAction
     * @return {this}
     */
    reshape(reshapeAction) {
        return this.addAction(reshapeAction);
    }
    /**
     * @description Resize the asset using provided resize action
     * @param {ResizeSimpleAction} resizeAction
     * @return {this}
     */
    resize(resizeAction) {
        return this.addAction(resizeAction);
    }
    /**
     * @param {DeliveryAction} quality
     * @return {this}
     */
    quality(quality) {
        return this.addAction(quality);
    }
    /**
     * @description Rounds the specified corners of an image.
     * @param roundCornersAction
     * @return {this}
     */
    roundCorners(roundCornersAction) {
        return this.addAction(roundCornersAction);
    }
    /**
     * @description Adds an overlay over the base image.
     * @param {LayerAction} overlayAction
     * @return {this}
     */
    overlay(overlayAction) {
        return this.addAction(overlayAction);
    }
    /**
     * @description Adds an underlay under the base image.
     * @param {LayerAction} underlayAction
     * @return {this}
     */
    underlay(underlayAction) {
        underlayAction.setLayerType('u');
        return this.addAction(underlayAction);
    }
    /**
     * @description Defines an new user variable.
     * @param {VariableAction} variableAction
     * @return {this}
     */
    addVariable(variableAction) {
        return this.addAction(variableAction);
    }
    /**
     * @description Specifies a condition to be met before applying a transformation.
     * @param {ConditionalAction} conditionAction
     * @return {this}
     */
    conditional(conditionAction) {
        return this.addAction(conditionAction);
    }
    /**
     * @description Applies a filter or an effect on an asset.
     * @param {SimpleEffectAction} effectAction
     * @return {this}
     */
    effect(effectAction) {
        return this.addAction(effectAction);
    }
    /**
     * @description Applies adjustment effect on an asset.
     * @param action
     * @return {this}
     */
    adjust(action) {
        return this.addAction(action);
    }
    /**
     * @description Rotates the asset by the given angle.
     * @param {RotateAction} rotateAction
     * @return {this}
     */
    rotate(rotateAction) {
        return this.addAction(rotateAction);
    }
    /**
     * @description Applies a pre-defined named transformation of the given name.
     * @param {NamedTransformation} namedTransformation
     * @return {this}
     */
    namedTransformation(namedTransformation) {
        return this.addAction(namedTransformation);
    }
    /**
     * @description Applies delivery action.
     * @param deliveryAction
     * @return {this}
     */
    delivery(deliveryAction) {
        return this.addAction(deliveryAction);
    }
    /**
     * @description Sets the color of the background.
     * @param {Qualifiers.Color} color
     * @return {this}
     */
    backgroundColor(color) {
        return this.addAction(new BackgroundColor(prepareColor(color)));
    }
    /**
     * @description Adds a layer in a Photoshop document.
     * @param action
     * @return {this}
     */
    psdTools(action) {
        return this.addAction(action);
    }
    /**
     * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
     * @param action
     * @return {this}
     */
    extract(action) {
        return this.addAction(action);
    }
    /**
     * @description Adds a flag as a separate action.
     * @param {Qualifiers.Flag | string} flagQualifier
     * @return {this}
     */
    addFlag(flagQualifier) {
        const action = new Action();
        let flagToAdd = flagQualifier;
        if (typeof flagQualifier === 'string') {
            flagToAdd = new FlagQualifier(flagQualifier);
        }
        action.addQualifier(flagToAdd);
        return this.addAction(action);
    }
    /**
     * @description Inject a custom function into the image transformation pipeline.
     * @return {this}
     */
    customFunction(customFunction) {
        return this.addAction(customFunction);
    }
    /**
     * Transcodes the video (or audio) to another format.
     * @param {Action} action
     * @return {this}
     */
    transcode(action) {
        return this.addAction(action);
    }
    /**
     * Applies the specified video edit action.
     *
     * @param {videoEditType} action
     * @return {this}
     */
    videoEdit(action) {
        return this.addAction(action);
    }
    toJson() {
        const actions = [];
        for (const action of this.actions) {
            const json = action.toJson();
            if (isErrorObject(json)) {
                // Fail early and return an IErrorObject
                return json;
            }
            actions.push(json);
        }
        return { actions };
    }
}
export { Transformation };
