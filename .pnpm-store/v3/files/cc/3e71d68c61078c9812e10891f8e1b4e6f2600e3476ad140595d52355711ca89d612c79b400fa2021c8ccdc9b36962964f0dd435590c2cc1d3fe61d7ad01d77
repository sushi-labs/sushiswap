import { BackgroundQualifier } from "./BackgroundQualifier.js";
import { SystemColors } from "../../../color.js";
/**
 * @description Defines the background color to use when resizing with padding.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BackgroundQualifier}
 */
declare class BaseCommonBackground extends BackgroundQualifier {
    protected _palette: string[];
    protected _contrast: boolean;
    constructor();
    /**
     * @description Selects the strongest contrasting color to use for padding.
     * @return {this}
     */
    contrast(): this;
    /**
     * @description Defines the custom colors to use when resizing using content-aware padding.
     * @param {...string} colors One or more colors - Example: palette('green', 'red', blue')
     * @return {this}
     */
    palette(...colors: SystemColors[]): this;
}
export { BaseCommonBackground };
