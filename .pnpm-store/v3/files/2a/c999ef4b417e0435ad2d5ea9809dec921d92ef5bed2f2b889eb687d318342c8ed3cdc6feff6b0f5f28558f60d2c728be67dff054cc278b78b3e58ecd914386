import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @extends SDK.Action
 * @description Converts the colors of every pixel in an image based on the supplied color matrix, in which the value of each color channel is calculated based on the values from all other channels (e.g. a 3x3 matrix for RGB, a 4x4 matrix for RGBA or CMYK, etc).<br/>
 * For every pixel in the image, take each color channel and adjust its value by the specified values of the matrix to get a new value.
 * @memberOf Actions.Adjust
 */
class RecolorAction extends Action {
    constructor(recolorMatrix) {
        super();
        this.matrix = recolorMatrix;
        // Turn the matrix into a flat array of values
        // the values are ordered by row
        // [...row1, ...row2, ...row3, ..., row(n) ]
        const flat = [];
        for (let row = 0; row < recolorMatrix.length; row++) {
            for (let col = 0; col < recolorMatrix[row].length; col++) {
                flat.push(recolorMatrix[row][col].toString());
            }
        }
        const qualifierValue = new QualifierValue(['recolor', ...flat]).setDelimiter(':');
        this.addQualifier(new Qualifier('e', qualifierValue));
    }
}
export { RecolorAction };
