import { Action } from "../../internal/Action.js";
import { SystemColors } from "../../qualifiers/color.js";
/**
 * @description Changes the main background color to the one specified, as if a 'theme change' was applied (e.g. dark mode vs light mode).
 * @extends SDK.Action
 * @memberOf {Actions.Effect}
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class ThemeEffect extends Action {
    private color;
    private _photosensitivity;
    private effectName;
    constructor(color: SystemColors);
    /**
     * @description The sensitivity to photographic elements of an image.
     *              A value of 0 treats the whole image as non-photographic.
     *              A value of 200 treats the whole image as photographic, so no theme change is applied.
     * @param {number} photosensitivity
     * @return {this}
     */
    photosensitivity(photosensitivity: number): this;
    protected prepareQualifiers(): void;
}
export { ThemeEffect };
