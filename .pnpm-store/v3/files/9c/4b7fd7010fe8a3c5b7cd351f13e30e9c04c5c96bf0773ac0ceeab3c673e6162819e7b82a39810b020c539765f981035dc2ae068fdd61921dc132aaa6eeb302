'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_videoEdit_TrimAction = require('./videoEdit/TrimAction.cjs');
var actions_videoEdit_ConcatenateAction = require('./videoEdit/ConcatenateAction.cjs');
var actions_videoEdit_VolumeAction = require('./videoEdit/VolumeAction.cjs');
var actions_videoEdit_PreviewAction = require('./videoEdit/PreviewAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../transformation/Transformation.cjs');
require('./background/actions/BackgroundColor.cjs');
require('../internal/utils/prepareColor.cjs');
require('../internal/RawAction.cjs');
require('../internal/models/IErrorObject.cjs');
require('../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../qualifiers/source/BaseSource.cjs');
require('../internal/models/createSourceFromModel.cjs');
require('../internal/models/IImageSourceModel.cjs');
require('../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../internal/models/IFetchSourceModel.cjs');
require('../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../internal/utils/base64Encode.cjs');
require('../internal/models/ITextSourceModel.cjs');
require('../qualifiers/source/sourceTypes/TextSource.cjs');
require('../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../qualifiers/textStyle.cjs');
require('../qualifiers/fontWeight.cjs');
require('../qualifiers/fontStyle.cjs');
require('../qualifiers/textDecoration.cjs');
require('../internal/utils/serializeCloudinaryCharacters.cjs');
require('../qualifiers/textStroke.cjs');
require('../internal/models/IStrokeModel.cjs');
require('../internal/models/createTextStyleFromModel.cjs');
require('../internal/utils/toFloatAsString.cjs');

/**
 * @summary action
 * @description Methods for editing a video.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/video_manipulation_and_delivery|Video manipulation}
 * @memberOf Actions
 * @namespace VideoEdit
 * @example
 * See the examples under every method
 */
/**
 * @summary action
 * @description Concatenates another video.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#concatenating_videos|Concatenating videos}
 *
 * @memberOf Actions.VideoEdit
 * @param {VideoSource} source The source to concatenate.
 * @return {Actions.VideoEdit.ConcatenateAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {concatenate} from "@cloudinary/url-gen/actions/videoEdit";
 * import {videoSource as concatVideoSource} from "@cloudinary/url-gen/qualifiers/concatenate";
 * import {videoSource as tVideoSource} from "@cloudinary/url-gen/qualifiers/transition.js";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.videoEdit( concatenate(concatVideoSource('butterfly'))
 *  .transition(tVideoSource('myTransition'))
 *  .duration(5)
 * )
 */
function concatenate(source) {
    return new actions_videoEdit_ConcatenateAction(source);
}
/**
 * @summary action
 * @description Trims a video (and discards the rest).
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#trimming_videos|
  * Trimming videos}
 *
 * @memberOf Actions.VideoEdit
 * @return {Actions.VideoEdit.TrimAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {trim} from "@cloudinary/url-gen/actions/videoEdit";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.videoEdit( trim()
 *  .startOffset(3)
 *  .endOffset(4)
 *  .duration(10)
 * )
 */
function trim() {
    return new actions_videoEdit_TrimAction();
}
/**
 * @summary action
 * @description Increases or decreases the volume by a percentage of the current volume.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/audio_transformations#adjust_the_audio_volume|
  * Adjust the audio volume}
 *
 * @memberOf Actions.VideoEdit
 * @param {string | number} volumeValue The value of volume. The percentage change of volume (Range: -100 to 400).
 * For a list of supported types see {@link Qualifiers.Volume| Volume values}
 * @return {Actions.VideoEdit.VolumeAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {volume} from "@cloudinary/url-gen/actions/videoEdit";
 * import {mute} from '@cloudinary/url-gen/qualifiers/volume';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.videoEdit( volume(10) ) // as percent
 * video.videoEdit( volume('5db') ) // as decibels
 * video.videoEdit( volume(mute()) ) // if you prefer silence..
 */
function volume(volumeValue) {
    return new actions_videoEdit_VolumeAction(volumeValue);
}
/**
 * @summary action
 * @description A video preview is a short excerpt from a video that can be used to engage your audience and help them select the video content that interests them.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#generate_an_ai_based_video_preview|
  * Create a video preview}
 *
 * @memberOf Actions.VideoEdit
 * @return {Actions.VideoEdit.PreviewAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {preview} from "@cloudinary/url-gen/actions/videoEdit";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.videoEdit( preview()
 *  .duration(5)
 *  .minimumSegmentDuration(1)
 *  .maximumSegments(10)
 * )
 */
function preview() {
    return new actions_videoEdit_PreviewAction.PreviewAction();
}
var VideoEdit = { concatenate: concatenate, trim: trim, volume: volume, preview: preview };

exports.VideoEdit = VideoEdit;
exports.concatenate = concatenate;
exports.preview = preview;
exports.trim = trim;
exports.volume = volume;
