import { Action } from "../../internal/Action.js";
/**
 * @extends SDK.Action
 * @description Converts the colors of every pixel in an image based on the supplied color matrix, in which the value of each color channel is calculated based on the values from all other channels (e.g. a 3x3 matrix for RGB, a 4x4 matrix for RGBA or CMYK, etc).<br/>
 * For every pixel in the image, take each color channel and adjust its value by the specified values of the matrix to get a new value.
 * @memberOf Actions.Adjust
 */
declare class RecolorAction extends Action {
    readonly matrix: number[][];
    constructor(recolorMatrix: number[][]);
}
export { RecolorAction };
