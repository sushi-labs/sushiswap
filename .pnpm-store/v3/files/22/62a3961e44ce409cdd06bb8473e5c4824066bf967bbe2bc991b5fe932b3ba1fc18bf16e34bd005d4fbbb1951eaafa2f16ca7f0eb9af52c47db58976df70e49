import { prepareColor } from "../../../../internal/utils/prepareColor.js";
import { BackgroundQualifier } from "./BackgroundQualifier.js";
/**
 * @description Defines the background color to use when resizing with padding.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BackgroundQualifier}
 */
class BaseCommonBackground extends BackgroundQualifier {
    constructor() {
        super();
        this._palette = [];
    }
    /**
     * @description Selects the strongest contrasting color to use for padding.
     * @return {this}
     */
    contrast() {
        this._contrast = true;
        return this;
    }
    /**
     * @description Defines the custom colors to use when resizing using content-aware padding.
     * @param {...string} colors One or more colors - Example: palette('green', 'red', blue')
     * @return {this}
     */
    palette(...colors) {
        this._palette = colors.map((color) => {
            return prepareColor(color);
        });
        return this;
    }
}
export { BaseCommonBackground };
