'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_source_sourceTypes_VideoSource = require('./source/sourceTypes/VideoSource.cjs');
var qualifiers_source_sourceTypes_ImageSource = require('./source/sourceTypes/ImageSource.cjs');
var qualifiers_source_sourceTypes_FetchSource = require('./source/sourceTypes/FetchSource.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./source/BaseSource.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('./format/FormatQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/utils/base64Encode.cjs');

/**
 * @description This namespace contains different sources that can be used when concatenating to a video
 * @memberOf Qualifiers
 * @namespace Concatenate
 * @see Visit {@link Actions.VideoEdit.concatenate|VideoEdit.concatenate} for an example
 */
/**
 * @summary qualifier
 * @description Returns an instance of an ImageSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} publicID The publicID of the image to be used to concatenate
 * @return {Source.ImageSource}
 */
function imageSource(publicID) {
    return new qualifiers_source_sourceTypes_ImageSource.ImageSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} publicID The publicID of the video to be used to concatenate
 * @return {Source.VideoSource}
 */
function videoSource(publicID) {
    return new qualifiers_source_sourceTypes_VideoSource.VideoSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a FetchSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} remoteURL The URL of the remote asset to fetch as and to be used to concatenate
 * @return {Source.FetchSource}
 */
function fetchSource(remoteURL) {
    return new qualifiers_source_sourceTypes_FetchSource.FetchSource(remoteURL);
}
var Concatenate = { imageSource: imageSource, videoSource: videoSource, fetchSource: fetchSource };

exports.Concatenate = Concatenate;
exports.fetchSource = fetchSource;
exports.imageSource = imageSource;
exports.videoSource = videoSource;
