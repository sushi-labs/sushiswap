import { NamedRegion } from "./NamedRegion.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @memberOf Qualifiers.Region
 */
class CustomRegion extends NamedRegion {
    constructor() {
        super('named');
    }
    /**
     * @description The x position in pixels.
     * @param {number} x
     */
    x(x) {
        this.addQualifier(new Qualifier('x', x));
        return this;
    }
    /**
     * @description The y position in pixels.
     * @param {number} y
     */
    y(y) {
        this.addQualifier(new Qualifier('y', y));
        return this;
    }
    /**
     * @description The width of the region in pixels.
     * @param {number} width
     */
    width(width) {
        this.addQualifier(new Qualifier('w', width));
        return this;
    }
    /**
     * @description The height of the region in pixels.
     * @param {number} height
     */
    height(height) {
        this.addQualifier(new Qualifier('h', height));
        return this;
    }
}
export { CustomRegion };
