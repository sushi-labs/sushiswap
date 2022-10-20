import { NamedRegion } from "../../../qualifiers/region/NamedRegion.js";
import { Action } from "../../../internal/Action.js";
import { IPixelateModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description The Action class of the pixelate Builder
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class Pixelate extends Action {
    private _region?;
    private _squareSize;
    protected _actionModel: IPixelateModel;
    constructor(squareSize: number | string);
    /**
     * @description Specifies the region to piexlate.
     * @param {NamedRegion} pixelateRegion
     */
    region(pixelateRegion: NamedRegion): this;
    /**
     * @description Sets the squareSize of the pixelate effect.
     * @param {number | string} squareSize
     */
    squareSize(squareSize: number | string): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): Pixelate;
}
export { Pixelate };
