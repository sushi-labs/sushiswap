import { BaseCommonBackground } from "./BaseCommonBackground.js";
import { GradientDirectionQualifierValue } from "../../../gradientDirection/GradientDirectionQualifierValue.js";
import { GradientDirectionType } from "../../../../types/types.js";
/**
 * @description Defines the gradient fade effect to use for the background when resizing with padding.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BaseCommonBackground}
 */
declare class BaseGradientBackground extends BaseCommonBackground {
    protected _gradientColors: number;
    protected _gradientDirection: GradientDirectionType | GradientDirectionQualifierValue;
    /**
     *
     * @description Sets the number of predominant colors to use (2 or 4).
     * @param {number} num
     * @return {this}
     */
    gradientColors(num: number): this;
    /**
     * @description Sets the direction for a background gradient fade effect.
     * @param {Qualifiers.GradientDirection | GradientDirectionType | string} direction Use one of these functions
     * provided by {@link Qualifiers.GradientDirection|GradientDirection}
     * @return {this}
     */
    gradientDirection(direction: GradientDirectionType | GradientDirectionQualifierValue): this;
}
export { BaseGradientBackground };
