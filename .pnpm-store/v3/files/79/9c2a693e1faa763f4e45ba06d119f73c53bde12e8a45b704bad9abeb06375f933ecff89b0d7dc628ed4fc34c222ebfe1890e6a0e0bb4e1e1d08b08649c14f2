'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_Action = require('../internal/Action.cjs');
var qualifiers_expression = require('../qualifiers/expression.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../qualifiers/expression/ExpressionQualifier.cjs');

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
var ConditionalAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ConditionalAction, _super);
    /**
     * @description Specifies a condition to be met before applying a transformation.
     * @param {string} exp The condition to meet in order to apply the transformation.
     * @param {SDK.Transformation} ifTx The transformation to conditionally apply
     */
    function ConditionalAction(exp, ifTx) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: "ifCondition" };
        _this.exp = exp;
        _this.ifTx = ifTx;
        _this._actionModel.expression = exp;
        _this._actionModel.transformation = ifTx;
        return _this;
    }
    /**
     * @description An alternate transformation in case the initial condition is false
     * Alias to `else` in many programming languages
     * @param {SDK.Transformation} elseTx
     */
    ConditionalAction.prototype.otherwise = function (elseTx) {
        this.elseTx = elseTx;
        this._actionModel.otherwise = elseTx;
        return this;
    };
    ConditionalAction.prototype.toString = function () {
        return [
            "if_" + qualifiers_expression.expression(this.exp),
            "" + this.ifTx,
            this.elseTx && "if_else/" + this.elseTx,
            "if_end"
        ].filter(function (a) { return a; }).join('/');
    };
    ConditionalAction.fromJson = function (actionModel) {
        var _a = actionModel, expression = _a.expression, transformation = _a.transformation, otherwise = _a.otherwise;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(expression, transformation);
        otherwise && result.otherwise(otherwise);
        return result;
    };
    return ConditionalAction;
}(internal_Action.Action));
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
function ifCondition(expression, tx) {
    return new ConditionalAction(expression, tx);
}
var Conditional = { ifCondition: ifCondition, ConditionalAction: ConditionalAction };

exports.Conditional = Conditional;
exports.ConditionalAction = ConditionalAction;
exports.ifCondition = ifCondition;
