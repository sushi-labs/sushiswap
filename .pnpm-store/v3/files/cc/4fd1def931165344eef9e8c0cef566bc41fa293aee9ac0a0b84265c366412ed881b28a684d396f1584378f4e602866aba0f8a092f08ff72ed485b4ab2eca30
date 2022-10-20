import { Action } from "../../internal/Action.js";
import { SystemColors } from "../../qualifiers/color.js";
import { OutlineModeType } from "../../types/types.js";
import { IEffectOutlineModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Adds an outline to a transparent image. For examples, see the Image Transformations guide.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class EffectOutline extends Action {
    private _mode;
    private _width;
    private _blurLevel;
    protected _actionModel: IEffectOutlineModel;
    constructor();
    /**
     * @description
     * How to apply the outline effect which can be one of the following values:
     * inner, inner_fill, outer, fill.
     * @param {OutlineModeType|string} mode  The type of outline effect. Use the constants defined in Outline.
     * @return {this}
     */
    mode(mode?: OutlineModeType | string): this;
    /**
     * The thickness of the outline in pixels. (Range: 1 to 100, Server default: 5)
     * @param {number} width
     * @return {this}
     */
    width(width?: number | string): this;
    /**
     * @description
     * The level of blur of the outline.
     * Range: 0 to 2000, Server default: 0
     * @param {number | string} lvl
     * @return {this}
     */
    blurLevel(lvl?: number | string): this;
    /**
     * @param {string | Qualifiers.Color} color One of the SDK Color values, string, or rgba: '#fff'
     * @return {this}
     */
    color(color: SystemColors): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): EffectOutline;
}
export { EffectOutline };
