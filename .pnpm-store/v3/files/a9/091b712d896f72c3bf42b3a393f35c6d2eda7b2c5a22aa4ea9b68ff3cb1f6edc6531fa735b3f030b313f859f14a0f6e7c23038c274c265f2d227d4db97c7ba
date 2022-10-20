import { Action } from "../../internal/Action.js";
import { IVectorizeEffectModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Vectorizes the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class VectorizeEffectAction extends Action {
    private _numOfColors;
    private _detailsLevel;
    private _despeckleLevel;
    private _cornersLevel;
    private _paths;
    protected _actionModel: IVectorizeEffectModel;
    constructor();
    /**
     * @description The number of colors. (Range: 2 to 30, Server default: 10)
     * @param {number | string} num
     * @return {this}
     */
    numOfColors(num: number | string): this;
    /**
     * @description The level of detail. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 1000). (Server default: 300)
     * @param {number | string} num
     * @return {this}
     */
    detailsLevel(num: number | string): this;
    /**
     * @description The size of speckles to suppress. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 100, Server default: 2)
     * @param {number | string} num
     * @return {this}
     */
    despeckleLevel(num: number | string): this;
    /**
     * @description The corner threshold. Specify 100 for no smoothing (polygon corners), 0 for completely smooth corners. (Range: 0 to 100, Default: 25)
     * @param {number | string} num
     * @return {this}
     */
    cornersLevel(num: number | string): this;
    /**
     * @description The optimization value. Specify 100 for least optimization and the largest file. (Range: 0 to 100, Server default: 100).
     * @param {number} num
     * @return {this}
     */
    paths(num: number): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): VectorizeEffectAction;
}
export { VectorizeEffectAction };
