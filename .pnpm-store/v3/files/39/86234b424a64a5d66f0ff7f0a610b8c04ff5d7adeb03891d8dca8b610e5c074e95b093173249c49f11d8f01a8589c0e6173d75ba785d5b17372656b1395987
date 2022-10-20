import { FlagQualifier } from "../qualifiers/flag/FlagQualifier.js";
import { Qualifier } from "./qualifier/Qualifier.js";
import { FlagTypes } from "../types/types.js";
import { ActionModel } from "./models/ActionModel.js";
/**
 * @summary SDK
 * @memberOf SDK
 * @description Defines the category of transformation to perform.
 */
declare class Action extends ActionModel {
    qualifiers: Map<string, Qualifier>;
    flags: FlagQualifier[];
    private delimiter;
    protected prepareQualifiers(): void;
    private actionTag;
    /**
     * @description Returns the custom name tag that was given to this action
     * @return {string}
     */
    getActionTag(): string;
    /**
     * @description Sets the custom name tag for this action
     * @return {this}
     */
    setActionTag(tag: string): this;
    /**
     * @description Calls toString() on all child qualifiers (implicitly by using .join()).
     * @return {string}
     */
    toString(): string;
    /**
     * @description Adds the parameter to the action.
     * @param {SDK.Qualifier} qualifier
     * @return {this}
     */
    addQualifier(qualifier: Qualifier | string): this;
    /**
     * @description Adds a flag to the current action.
     * @param {Qualifiers.Flag} flag
     * @return {this}
     */
    addFlag(flag: FlagTypes | FlagQualifier | string): this;
    protected addValueToQualifier(qualifierKey: string, qualifierValue: any): this;
}
export { Action };
