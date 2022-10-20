import { FlagQualifier } from "../qualifiers/flag/FlagQualifier.js";
import { Qualifier } from "./qualifier/Qualifier.js";
import { mapToSortedArray } from "./utils/dataStructureUtils.js";
import { ActionModel } from "./models/ActionModel.js";
/**
 * @summary SDK
 * @memberOf SDK
 * @description Defines the category of transformation to perform.
 */
class Action extends ActionModel {
    constructor() {
        super(...arguments);
        // We're using map, to overwrite existing keys. for example:
        // addParam(w_100).addQualifier(w_200) should result in w_200. and not w_100,w_200
        this.qualifiers = new Map();
        // Unlike regular qualifiers, there can be multiple flags in each url component /fl_1,fl_2/
        // If the falgs are added to the qualifiers map, only a single flag could exist in a component (it's a map)
        // So flags are stored separately until the very end because of that reason
        this.flags = [];
        this.delimiter = ','; // {qualifier}{delimiter}{qualifier} for example: `${'w_100'}${','}${'c_fill'}`
        this.actionTag = ''; // A custom name tag to identify this action in the future
    }
    prepareQualifiers() { }
    /**
     * @description Returns the custom name tag that was given to this action
     * @return {string}
     */
    getActionTag() {
        return this.actionTag;
    }
    /**
     * @description Sets the custom name tag for this action
     * @return {this}
     */
    setActionTag(tag) {
        this.actionTag = tag;
        return this;
    }
    /**
     * @description Calls toString() on all child qualifiers (implicitly by using .join()).
     * @return {string}
     */
    toString() {
        this.prepareQualifiers();
        return mapToSortedArray(this.qualifiers, this.flags).join(this.delimiter);
    }
    /**
     * @description Adds the parameter to the action.
     * @param {SDK.Qualifier} qualifier
     * @return {this}
     */
    addQualifier(qualifier) {
        // if string, find the key and value
        if (typeof qualifier === 'string') {
            const [key, value] = qualifier.toLowerCase().split('_');
            if (key === 'fl') {
                // if string qualifier is a flag, store it in the flags arrays
                this.flags.push(new FlagQualifier(value));
            }
            else {
                // if the string qualifier is not a flag, create a new qualifier from it
                this.qualifiers.set(key, new Qualifier(key, value));
            }
        }
        else {
            // if a qualifier object, insert to the qualifiers map
            this.qualifiers.set(qualifier.key, qualifier);
        }
        return this;
    }
    /**
     * @description Adds a flag to the current action.
     * @param {Qualifiers.Flag} flag
     * @return {this}
     */
    addFlag(flag) {
        if (typeof flag === 'string') {
            this.flags.push(new FlagQualifier(flag));
        }
        else {
            if (flag instanceof FlagQualifier) {
                this.flags.push(flag);
            }
        }
        return this;
    }
    addValueToQualifier(qualifierKey, qualifierValue) {
        this.qualifiers.get(qualifierKey).addValue(qualifierValue);
        return this;
    }
}
export { Action };
