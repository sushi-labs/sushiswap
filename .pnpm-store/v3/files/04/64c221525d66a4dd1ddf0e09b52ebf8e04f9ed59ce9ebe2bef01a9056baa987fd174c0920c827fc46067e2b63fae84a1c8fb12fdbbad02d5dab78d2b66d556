'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_gravity_GravityQualifier = require('../GravityQualifier.cjs');
require('../../../internal/qualifier/Qualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');

/**
 * @description The class for the FocusOn builder
 * @memberOf Qualifiers.Gravity
 * @extends {Qualifiers.Gravity.GravityQualifier}
 */
var FocusOnGravity = /** @class */ (function (_super) {
    tslib_es6.__extends(FocusOnGravity, _super);
    function FocusOnGravity(FocusOnObjects) {
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        return _super.call(this, FocusOnObjects) || this;
    }
    /**
     * @description Specifies the gravity to use if none of the other gravity objects are found.
     * @param {Qualifiers.Gravity.AutoGravity} val
     */
    FocusOnGravity.prototype.fallbackGravity = function (val) {
        /*
         *  FocusOnGravity(this) is already a qualifier, with a key and a value g_{obj1}
         *  fallBackGravity also attempts to add a value, to reach the result of g_{obj1}:auto:{obj2}
         *  Since AutoGravity is a Qualifier, it also comes with its own g_ key, which needs to be removed.
         *  To solve it, we take only the value from the qualifier, instead of the whole thing
         */
        this.addValue(val.qualifierValue);
        return this;
    };
    return FocusOnGravity;
}(qualifiers_gravity_GravityQualifier.GravityQualifier));

exports.FocusOnGravity = FocusOnGravity;
