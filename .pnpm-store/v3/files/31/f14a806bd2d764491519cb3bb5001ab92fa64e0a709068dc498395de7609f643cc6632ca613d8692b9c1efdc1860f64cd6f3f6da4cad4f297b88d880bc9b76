'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var transformation_Transformation = require('../../transformation/Transformation.cjs');
var qualifiers_source_sourceTypes_VideoSource = require('../../qualifiers/source/sourceTypes/VideoSource.cjs');
var internal_models_createSourceFromModel = require('../../internal/models/createSourceFromModel.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../background/actions/BackgroundColor.cjs');
require('../../internal/utils/prepareColor.cjs');
require('../../internal/RawAction.cjs');
require('../../internal/models/IErrorObject.cjs');
require('../../qualifiers/source/BaseSource.cjs');
require('../../internal/models/IImageSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../../internal/models/IFetchSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../../internal/utils/base64Encode.cjs');
require('../../internal/models/ITextSourceModel.cjs');
require('../../qualifiers/source/sourceTypes/TextSource.cjs');
require('../../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../../qualifiers/textStyle.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../../internal/utils/serializeCloudinaryCharacters.cjs');
require('../../qualifiers/textStroke.cjs');
require('../../internal/models/IStrokeModel.cjs');
require('../../internal/models/createTextStyleFromModel.cjs');

/**
 * @description Class for Concatenating another video.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#concatenating_videos|Concatenating videos}
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
var ConcatenateAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ConcatenateAction, _super);
    /**
     *
     * @param {Qualifiers.Source.VideoSource | Qualifiers.Source.ImageSource | Qualifiers.Source.FetchSource} source
     *         the Source to concatenate
     */
    function ConcatenateAction(source) {
        var _this = _super.call(this) || this;
        _this._actionModel = {
            actionType: 'concatenate',
            source: source.toJson()
        };
        _this.concatSource = source;
        return _this;
    }
    /**
     * @description Sets the transition between a video and a concatenated source
     * @param {Qualifiers.Transition.VideoSource} source The source to concatenate.
     * @return {this}
     */
    ConcatenateAction.prototype.transition = function (source) {
        this._actionModel.transition = source.toJson();
        this._transition = source;
        return this;
    };
    /**
     * @description Prepend the concatenated video - Adds the video before the original
     * @return {this}
     */
    ConcatenateAction.prototype.prepend = function () {
        this._actionModel.prepend = true;
        this._prepend = true;
        return this;
    };
    /**
     * The duration in seconds
     * @param {number} sec
     * @return {this}
     */
    ConcatenateAction.prototype.duration = function (sec) {
        this._actionModel.duration = sec;
        this._duration = sec;
        return this;
    };
    /**
     * @description Get the transitionString for the toString() method
     * @return {string}
     */
    ConcatenateAction.prototype.getTransitionString = function () {
        var transTx = this._transition.getTransformation();
        return [
            "e_transition," + this._transition.getOpenSourceString('l'),
            transTx && transTx.toString(),
            'fl_layer_apply'
        ].filter(function (a) { return a; }).join('/');
    };
    /**
     * @description Get the string representation of the Concatenation action
     */
    ConcatenateAction.prototype.toString = function () {
        /*
         *
         * The toString() method is composed of several steps due to the complex nature of the concatenate transformation.
         *
         * First, we calculate the open and close parts of the top-level transformation:
         *   - {open}/{sourceTransformation}/{close}
         *
         * Unlike a regular overlay, there are multiple 'bits' appended to the open and close parts of the tx.
         * - duration (du_) might be prepended on the opening of the layer (du_5,l_sample)
         * - fl_splice is also added, but only if a transition is not needed.
         *
         * once we've calculated the open and close parts, we now need to deal with the Transition.
         * the transition is an inner transformation on the source with a special effect (e_transition) appended to it.
         *
         * To calculate the transition string, we need to take the transformation from the source(assuming it has one)
         */
        // Calculate the open part
        var open = [
            this._duration && "du_" + this._duration,
            !this._transition && "fl_splice",
            "" + this.concatSource.getOpenSourceString('l')
        ].filter(function (a) { return a; }).join(',');
        // Calculate the open part
        var close = [
            'fl_layer_apply',
            this._prepend && 'so_0'
        ].filter(function (a) { return a; }).join(',');
        // Calculate the Transition part
        var concatSourceTx;
        if (this.concatSource.getTransformation()) {
            concatSourceTx = this.concatSource.getTransformation();
        }
        else {
            concatSourceTx = new transformation_Transformation.Transformation();
        }
        if (this._transition) {
            concatSourceTx.addTransformation(this.getTransitionString());
        }
        // Put it all together, the transition is already part of the concatSourceTx
        return [
            open,
            concatSourceTx.toString(),
            close
        ].filter(function (a) { return a; }).join('/');
    };
    ConcatenateAction.fromJson = function (actionModel, transformationFromJson) {
        var _a = actionModel, source = _a.source, transition = _a.transition, prepend = _a.prepend, duration = _a.duration;
        var sourceInstance = internal_models_createSourceFromModel.createSourceFromModel(source, transformationFromJson);
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(sourceInstance);
        if (transition) {
            result.transition(qualifiers_source_sourceTypes_VideoSource.VideoSource.fromJson(transition, transformationFromJson));
        }
        if (prepend) {
            result.prepend();
        }
        if (duration) {
            result.duration(duration);
        }
        return result;
    };
    return ConcatenateAction;
}(internal_Action.Action));

module.exports = ConcatenateAction;
