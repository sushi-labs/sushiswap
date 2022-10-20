import { Action } from "../internal/Action.js";
import { Transformation } from "../transformation/Transformation.js";
import { IConditionalActionModel } from "../internal/models/IConditionalActionModel.js";
import { IActionModel } from "../internal/models/IActionModel.js";
/**
 * Sets up a conditional transformation.
 * @memberOf Actions
 * @namespace Conditional
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.conditional(
 *  Conditional.ifCondition('ar >= 1.0', new Transformation().addAction('w_100'))
 * );
 * image.toURL()
 * // Transformation will contain `if_ar_gte_1.0/w_100/if_end`
 */
/**
 * @memberOf Actions.Conditional
 * @see Actions.Conditional
 * @example
 * // To be used through a builder and not to be created as an instance!
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.conditional(
 *  Conditional.ifCondition('ar >= 1.0', new Transformation().addAction('w_100'))
 * );
 * image.toURL()
 * // Transformation will contain `if_ar_gte_1.0/w_100/if_end`
 */
declare class ConditionalAction extends Action {
    protected _actionModel: IConditionalActionModel;
    private ifTx;
    private elseTx;
    private exp;
    /**
     * @description Specifies a condition to be met before applying a transformation.
     * @param {string} exp The condition to meet in order to apply the transformation.
     * @param {SDK.Transformation} ifTx The transformation to conditionally apply
     */
    constructor(exp: string, ifTx: Transformation);
    /**
     * @description An alternate transformation in case the initial condition is false
     * Alias to `else` in many programming languages
     * @param {SDK.Transformation} elseTx
     */
    otherwise(elseTx: Transformation): this;
    toString(): string;
    static fromJson(actionModel: IActionModel): ConditionalAction;
}
/**
 * @summary action
 * @memberOf Actions.Conditional
 * @description Sets up a conditional transformation with expression.
 * Learn more: {@link https://cloudinary.com/documentation/conditional_transformations|Conditional transformations}
 *
 * @param {string} expression The condition to meet in order to apply the transformation.
 * @param {SDK.Transformation} tx The transformation to conditionally apply
 * @return {Actions.Conditional.ConditionalAction}
 */
declare function ifCondition(expression: string, tx: Transformation): ConditionalAction;
declare const Conditional: {
    ifCondition: typeof ifCondition;
    ConditionalAction: typeof ConditionalAction;
};
export { Conditional, ifCondition, ConditionalAction };
