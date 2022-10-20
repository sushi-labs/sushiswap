'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_source_sourceTypes_VideoSource = require('./source/sourceTypes/VideoSource.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./source/BaseSource.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @description This namespace contains different sources that can be used as a transition between two videos
 * @memberOf Qualifiers
 * @namespace Transition
 * @see Visit {@link Actions.VideoEdit.concatenate|VideoEdit.concatenate} for an example
 */
/**
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Transition
 * @param {string} publicID The publicID of the video to be used as a transition
 * @return {Qualifiers.Source.VideoSource}
 */
function videoSource(publicID) {
    return new qualifiers_source_sourceTypes_VideoSource.VideoSource(publicID);
}
var Transition = { videoSource: videoSource };

exports.Transition = Transition;
exports.videoSource = videoSource;
