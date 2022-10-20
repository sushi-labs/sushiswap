'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../internal/qualifier/Qualifier.cjs');
var internal_Action = require('../internal/Action.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
 * @memberOf Actions
 * @namespace Extract
 * @example
 * import {Cloudinary} from '@cloudinary/url-gen';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * import {getFrame, getPage} from '@cloudinary/url-gen/actions/extract';
 *
 * image.extract(
 *  getFrame()
 *    .byRange(1, 3) // These are mutually exclusive
 *    .byNumber(5) // These are mutually exclusive
 * );
 *
 * image.extract(
 *  getPage()
 *    .byRange(1, 3) // These are mutually exclusive
 *    .byNumber(5) // These are mutually exclusive
 * );
 *
 */
/**
 * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
 * @extends SDK.Action
 * @memberOf Actions.Extract
 * @see Visit {@link Actions.Extract} for examples
 */
var ExtractAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ExtractAction, _super);
    function ExtractAction() {
        var _this = _super.call(this) || this;
        _this.qualifierValue = new internal_qualifier_QualifierValue.QualifierValue();
        _this.qualifierValue.delimiter = ';';
        return _this;
    }
    /**
     * @description Extract an image containing only specified layer of an asset
     * @param {string|number} from The layer number
     */
    ExtractAction.prototype.byNumber = function (from) {
        this.qualifierValue.addValue(from);
        return this;
    };
    /**
     * @description Extract an image containing only specified range of layers of an asset
     * @param {string|number} from The layer number
     * @param {string|number} to The layer number
     */
    ExtractAction.prototype.byRange = function (from, to) {
        var range = new internal_qualifier_QualifierValue.QualifierValue(from);
        range.addValue(to);
        range.delimiter = '-';
        this.qualifierValue.addValue(range);
        return this;
    };
    ExtractAction.prototype.prepareQualifiers = function () {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('pg', this.qualifierValue));
        return this;
    };
    return ExtractAction;
}(internal_Action.Action));
/**
 * @summary action
 * @description Extracts an image containing only specified layers of a Photoshop image.
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
function getFrame() {
    return new ExtractAction();
}
/**
 * @summary action
 * @description Extracts the original content of an embedded object of a Photoshop image.
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
function getPage() {
    return new ExtractAction();
}
var Extract = {
    getFrame: getFrame, getPage: getPage, ExtractAction: ExtractAction
};

exports.Extract = Extract;
exports.ExtractAction = ExtractAction;
exports.getFrame = getFrame;
exports.getPage = getPage;
