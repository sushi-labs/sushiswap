'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var qualifiers_region_NamedRegion = require('./NamedRegion.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/Action.cjs');
require('../flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @memberOf Qualifiers.Region
 */
var CustomRegion = /** @class */ (function (_super) {
    tslib_es6.__extends(CustomRegion, _super);
    function CustomRegion() {
        return _super.call(this, 'named') || this;
    }
    /**
     * @description The x position in pixels.
     * @param {number} x
     */
    CustomRegion.prototype.x = function (x) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', x));
        return this;
    };
    /**
     * @description The y position in pixels.
     * @param {number} y
     */
    CustomRegion.prototype.y = function (y) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', y));
        return this;
    };
    /**
     * @description The width of the region in pixels.
     * @param {number} width
     */
    CustomRegion.prototype.width = function (width) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('w', width));
        return this;
    };
    /**
     * @description The height of the region in pixels.
     * @param {number} height
     */
    CustomRegion.prototype.height = function (height) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('h', height));
        return this;
    };
    return CustomRegion;
}(qualifiers_region_NamedRegion.NamedRegion));

exports.CustomRegion = CustomRegion;
