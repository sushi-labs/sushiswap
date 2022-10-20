import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { clip, clipEvenOdd } from "../../qualifiers/flag.js";
/**
 * @description  Defines the clipping path to use when trimming pixels.
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
class ClipAction extends Action {
    constructor() {
        super();
        this.isEvenOdd = false;
    }
    /**
     * @description The name of the path to clip by
     * @param {string} path
     * @return {this}
     */
    byName(path) {
        this.path = path;
        return this;
    }
    /**
     * @description The index of the path to clip by
     * @param {number} path
     * @return {this}
     */
    byIndex(path) {
        this.path = path;
        return this;
    }
    /**
     * @description Trims pixels according to a clipping path included in the original image using an evenodd clipping rule.
     * @return {this}
     */
    evenOdd() {
        this.isEvenOdd = true;
        return this;
    }
    prepareQualifiers() {
        let qualifierValue;
        if (typeof this.path === 'string') {
            qualifierValue = new QualifierValue(['name', this.path]).setDelimiter(':');
        }
        else {
            qualifierValue = new QualifierValue(this.path);
        }
        //handles flag
        if (this.isEvenOdd) {
            this.addFlag(clipEvenOdd());
        }
        else {
            this.addFlag(clip());
        }
        this.addQualifier(new Qualifier('pg', qualifierValue));
        return this;
    }
}
export { ClipAction };
