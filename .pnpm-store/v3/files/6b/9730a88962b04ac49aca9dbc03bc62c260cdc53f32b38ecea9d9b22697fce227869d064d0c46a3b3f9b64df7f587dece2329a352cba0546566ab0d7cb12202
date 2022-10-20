'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_source_sourceTypes_VideoSource = require('./source/sourceTypes/VideoSource.cjs');
var qualifiers_source_sourceTypes_ImageSource = require('./source/sourceTypes/ImageSource.cjs');
var qualifiers_source_sourceTypes_SubtitlesSource = require('./source/sourceTypes/SubtitlesSource.cjs');
var qualifiers_source_sourceTypes_FetchSource = require('./source/sourceTypes/FetchSource.cjs');
var qualifiers_source_sourceTypes_TextSource = require('./source/sourceTypes/TextSource.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./source/BaseSource.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('./source/sourceTypes/BaseTextSource.cjs');
require('./textStyle.cjs');
require('./fontWeight.cjs');
require('./fontStyle.cjs');
require('./textDecoration.cjs');
require('../internal/utils/serializeCloudinaryCharacters.cjs');
require('./textStroke.cjs');
require('../internal/models/IStrokeModel.cjs');
require('../internal/Action.cjs');
require('./flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../internal/utils/prepareColor.cjs');
require('./format/FormatQualifier.cjs');
require('../internal/utils/base64Encode.cjs');
require('../internal/models/createTextStyleFromModel.cjs');

/**
 * @description This namespace contains different sources that can be used in overlays and underlays
 * @memberOf Qualifiers
 * @namespace Source
 * @see {@link Actions.Overlay| The overlay action}
 * @see {@link Actions.Underlay| The underlay action}
 */
/**
 * @summary qualifier
 * @description Returns an instance of an ImageSource
 * @memberOf Qualifiers.Source
 * @param {string} publicID The publicID of the image to be used as a layer
 * @return {Qualifiers.Source.ImageSource}
 */
function image(publicID) {
    return new qualifiers_source_sourceTypes_ImageSource.ImageSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a TextSource
 * @memberOf Qualifiers.Source
 * @param {string} text The text to display.
 * @param {TextStyle | string} textStyle The textStyle to use with the text in the layer
 * @return {Qualifiers.Source.TextSource}
 */
function text(text, textStyle) {
    return new qualifiers_source_sourceTypes_TextSource.TextSource(text, textStyle);
}
/**
 * @summary qualifier
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Source
 * @param {string} publicID The publicID of the video to be used as a layer
 * @return {Qualifiers.Source.VideoSource}
 */
function video(publicID) {
    return new qualifiers_source_sourceTypes_VideoSource.VideoSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of an VideoSource
 * @memberOf Qualifiers.Source
 * @param {string} fileName The publicID of the video to be used as a layer
 * @return {Qualifiers.Source.VideoSource}
 */
function subtitles(fileName) {
    return new qualifiers_source_sourceTypes_SubtitlesSource.SubtitlesSource(fileName);
}
/**
 * @summary qualifier
 * @description Returns an instance of a FetchSource
 * @memberOf Qualifiers.Source
 * @param {string} remoteURL The URL of the remote asset to fetch as a layer
 * @return {Qualifiers.Source.FetchSource}
 */
function fetch(remoteURL) {
    return new qualifiers_source_sourceTypes_FetchSource.FetchSource(remoteURL);
}
var Source = { image: image, text: text, video: video, subtitles: subtitles, fetch: fetch };

exports.Source = Source;
exports.fetch = fetch;
exports.image = image;
exports.subtitles = subtitles;
exports.text = text;
exports.video = video;
