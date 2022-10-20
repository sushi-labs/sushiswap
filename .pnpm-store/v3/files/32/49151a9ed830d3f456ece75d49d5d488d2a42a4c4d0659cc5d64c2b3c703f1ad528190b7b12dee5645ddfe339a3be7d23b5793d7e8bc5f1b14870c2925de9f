import { NamedRegion } from "../../../qualifiers/region/NamedRegion.js";
import { Action } from "../../../internal/Action.js";
import { IBlurModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description The Action class of the blur Builder.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class BlurAction extends Action {
    private _region?;
    private _strength;
    protected _actionModel: IBlurModel;
    constructor(strength: number | string);
    /**
     * @description Specifies the region to blur.
     * @param {NamedRegion} blurRegion
     */
    region(blurRegion: NamedRegion): this;
    /**
     * @description Sets the strength of the blur effect.
     * @param {number | string} strength
     */
    strength(strength: number | string): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): BlurAction;
}
export { BlurAction };
