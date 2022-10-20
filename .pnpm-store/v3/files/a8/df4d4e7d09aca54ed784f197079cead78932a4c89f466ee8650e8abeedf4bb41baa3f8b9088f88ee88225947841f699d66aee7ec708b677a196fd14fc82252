import { Action } from "../../internal/Action.js";
/**
 * @description Skews the image according to the two specified values in degrees.
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
class ShearAction extends Action {
    constructor(x, y) {
        super();
        this.skewX(x);
        this.skewY(y);
    }
    /**
     * @param {number} x Skews the image according to the two specified values in degrees. (X and Y)
     */
    skewX(x) {
        this._x = x;
        return this;
    }
    /**
     * @param {number} y Skews the image according to the two specified values in degrees. (X and Y)
     */
    skewY(y) {
        this._y = y;
        return this;
    }
    toString() {
        return [
            'e_shear',
            this._x,
            this._y
        ].filter((a) => a).join(':');
    }
}
export { ShearAction };
