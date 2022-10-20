'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_layer_LayerAction = require('./layer/LayerAction.cjs');
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
require('../qualifiers/blendMode/BlendModeQualifier.cjs');
require('../internal/models/createSourceFromModel.cjs');
require('../internal/models/IImageSourceModel.cjs');
require('../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../qualifiers/source/BaseSource.cjs');
require('../internal/models/IFetchSourceModel.cjs');
require('../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../internal/utils/base64Encode.cjs');
require('../qualifiers/source/sourceTypes/VideoSource.cjs');
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
require('../internal/utils/prepareColor.cjs');
require('../internal/models/createTextStyleFromModel.cjs');
require('../internal/models/createPositionFromModel.cjs');
require('../qualifiers/position/PositionQualifier.cjs');
require('../qualifiers/flag.cjs');
require('../internal/models/createGravityModel.cjs');
require('../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../qualifiers/gravity/GravityQualifier.cjs');
require('../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../qualifiers/gravity.cjs');
require('../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../internal/models/createGravityFromModel.cjs');
require('../qualifiers/focusOn.cjs');
require('../qualifiers/autoFocus.cjs');
require('../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');
require('../internal/models/createTimelinePositionFromModel.cjs');
require('../qualifiers/video/TimelinePosition.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');

/**
 * @memberOf Actions
 * @namespace Underlay
 * @description Adds an image or a text layer as an underlay under the base layer. </br>
 * @see Visit {@link Qualifiers.TextStyle|TextStyle} for advanced text options
 * @see {@link Actions.Overlay| The overlay action}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const myVideo = yourCldInstance.video('dog');
 *
 * import {source} from "@cloudinary/url-gen/actions/underlay"
 * import {image, video, text} from "@cloudinary/url-gen/qualifiers/source"
 * import {TextStyle} from '@cloudinary/url-gen/qualifiers/textStyle
 *
 * myVideo.underlay(
 *       source(image('myImage'))
 *     )
 *
 * myVideo.underlay(
 *       source(video('myVideo'))
 *     )
 *
 * myVideo.underlay(
 *       source(text('My text'), 'arial_15')
 *     )
 *
 * // Or a text with more complex options
 * myVideo.underlay(
 *       source(text('My text'), new TextStyle('arial', 50))
 *     )
 */
/**
 * @summary action
 * @description Adds a layer for an asset
 * @param {Qualifiers.Source.ImageSource | Qualifiers.Source.TextSource} source
 *        The Source used for the layer, use the functions provided {@link Qualifiers.Source|here} to easily create these objects
 * @memberOf Actions.Underlay
 * @return {SDK.LayerAction}
 */
function source(source) {
    return new actions_layer_LayerAction.LayerAction(source)
        .setLayerType('u');
}
var Underlay = { source: source };

exports.Underlay = Underlay;
exports.source = source;
