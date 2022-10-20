'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_Action = require('../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../internal/qualifier/QualifierValue.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');

/**
 * @description Delivers an animated GIF that contains additional loops of the GIF.
 * The total number of iterations is the number of additional loops plus one.
 * You can also specify the loop effect without a numeric value to instruct it to loop the GIF infinitely.
 *
 * @memberOf Actions
 * @namespace Animated
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {animated} from "@cloudinary/url-gen/actions/animated";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.animated(edit().delay(200).loop(3)));
 */
/**
 * @memberOf Actions.Animated
 * @see Actions.Animated
 * @example
 * // Used through a builder function Animated.edit(), and not by creating a new instance
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {edit} from "@cloudinary/url-gen/actions/animated";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.animated(edit().delay(200).loop(3)));
 */
var AnimatedAction = /** @class */ (function (_super) {
    tslib_es6.__extends(AnimatedAction, _super);
    function AnimatedAction() {
        return _super.call(this) || this;
    }
    /**
     * @description Controls the time delay between the frames of an animated image, in milliseconds.
     * @param {number} delayValue The delay in milliseconds
     * @return {this}
     */
    AnimatedAction.prototype.delay = function (delayValue) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('dl', delayValue));
        return this;
    };
    /**
     * @description Delivers an animated GIF that contains additional loops of the GIF.
     * @param {number} additionalLoops The additional number of times to play the animated GIF.
     * @return {this}
     */
    AnimatedAction.prototype.loop = function (additionalLoops) {
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['loop', additionalLoops]).setDelimiter(':');
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return this;
    };
    return AnimatedAction;
}(internal_Action.Action));
/**
 * @summary action
 * @memberOf Actions.Animated
 * @description Delivers an animated GIF.
 * @return {Actions.Animated.AnimatedAction}
 */
function edit() {
    return new AnimatedAction();
}
var Animated = {
    edit: edit
};

exports.Animated = Animated;
exports.AnimatedAction = AnimatedAction;
exports.edit = edit;
