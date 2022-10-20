import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
/**
 * @description Vectorizes the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class VectorizeEffectAction extends Action {
    constructor() {
        super();
        this._actionModel = {};
        this._actionModel.actionType = 'vectorize';
    }
    /**
     * @description The number of colors. (Range: 2 to 30, Server default: 10)
     * @param {number | string} num
     * @return {this}
     */
    numOfColors(num) {
        this._actionModel.numOfColors = num;
        this._numOfColors = num;
        return this;
    }
    /**
     * @description The level of detail. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 1000). (Server default: 300)
     * @param {number | string} num
     * @return {this}
     */
    detailsLevel(num) {
        this._actionModel.detailLevel = num;
        this._detailsLevel = num;
        return this;
    }
    /**
     * @description The size of speckles to suppress. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 100, Server default: 2)
     * @param {number | string} num
     * @return {this}
     */
    despeckleLevel(num) {
        this._actionModel.despeckleLevel = num;
        this._despeckleLevel = num;
        return this;
    }
    /**
     * @description The corner threshold. Specify 100 for no smoothing (polygon corners), 0 for completely smooth corners. (Range: 0 to 100, Default: 25)
     * @param {number | string} num
     * @return {this}
     */
    cornersLevel(num) {
        this._actionModel.cornersLevel = num;
        this._cornersLevel = num;
        return this;
    }
    /**
     * @description The optimization value. Specify 100 for least optimization and the largest file. (Range: 0 to 100, Server default: 100).
     * @param {number} num
     * @return {this}
     */
    paths(num) {
        this._actionModel.paths = num;
        this._paths = num;
        return this;
    }
    prepareQualifiers() {
        let str = 'vectorize';
        if (this._numOfColors) {
            str += `:${new QualifierValue(`colors:${this._numOfColors}`).toString()}`;
        }
        if (this._detailsLevel) {
            str += `:${new QualifierValue(`detail:${this._detailsLevel}`).toString()}`;
        }
        if (this._despeckleLevel) {
            str += `:${new QualifierValue(`despeckle:${this._despeckleLevel}`).toString()}`;
        }
        if (this._paths) {
            str += `:${new QualifierValue(`paths:${this._paths}`).toString()}`;
        }
        if (this._cornersLevel) {
            str += `:${new QualifierValue(`corners:${this._cornersLevel}`).toString()}`;
        }
        this.addQualifier(new Qualifier('e', str));
    }
    static fromJson(actionModel) {
        const { actionType, paths, cornersLevel, despeckleLevel, detailLevel, numOfColors } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this();
        paths && result.paths(paths);
        cornersLevel && result.cornersLevel(cornersLevel);
        despeckleLevel && result.despeckleLevel(despeckleLevel);
        detailLevel && result.detailsLevel(detailLevel);
        numOfColors && result.numOfColors(numOfColors);
        return result;
    }
}
export { VectorizeEffectAction };
