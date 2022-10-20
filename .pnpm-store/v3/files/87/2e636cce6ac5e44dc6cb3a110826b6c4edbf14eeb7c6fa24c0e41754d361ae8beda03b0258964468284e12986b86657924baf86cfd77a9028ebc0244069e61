'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_resize_ResizeScaleAction = require('../actions/resize/ResizeScaleAction.cjs');
var actions_resize_ResizeFitAction = require('../actions/resize/ResizeFitAction.cjs');
var actions_resize_ResizeLimitFitAction = require('../actions/resize/ResizeLimitFitAction.cjs');
var transformation_Transformation = require('../transformation/Transformation.cjs');
var internal_utils_unsupportedError = require('./utils/unsupportedError.cjs');
var actions_resize_ResizeMinimumFitAction = require('../actions/resize/ResizeMinimumFitAction.cjs');
var actions_resize_ResizeCropAction = require('../actions/resize/ResizeCropAction.cjs');
var actions_resize_ResizeFillAction = require('../actions/resize/ResizeFillAction.cjs');
var actions_resize_ResizeLimitFillAction = require('../actions/resize/ResizeLimitFillAction.cjs');
var actions_resize_ThumbnailAction = require('../actions/resize/ThumbnailAction.cjs');
var actions_resize_ResizePadAction = require('../actions/resize/ResizePadAction.cjs');
var actions_resize_ResizeLimitPadAction = require('../actions/resize/ResizeLimitPadAction.cjs');
var actions_resize_ResizeMinimumPadAction = require('../actions/resize/ResizeMinimumPadAction.cjs');
var actions_delivery_DeliveryColorSpaceAction = require('../actions/delivery/DeliveryColorSpaceAction.cjs');
var actions_delivery_DeliveryColorSpaceFromICCAction = require('../actions/delivery/DeliveryColorSpaceFromICCAction.cjs');
var actions_delivery_DeliveryFormatAction = require('../actions/delivery/DeliveryFormatAction.cjs');
var actions_delivery_DeliveryQualityAction = require('../actions/delivery/DeliveryQualityAction.cjs');
var actions_effect_EffectActions_EffectActionWithLevel = require('../actions/effect/EffectActions/EffectActionWithLevel.cjs');
var actions_effect_EffectActions_SimpleEffectAction = require('../actions/effect/EffectActions/SimpleEffectAction.cjs');
var actions_effect_Shadow = require('../actions/effect/Shadow.cjs');
var actions_effect_Colorize = require('../actions/effect/Colorize.cjs');
var actions_effect_EffectActions_EffectActionWithStrength = require('../actions/effect/EffectActions/EffectActionWithStrength.cjs');
var actions_effect_Cartoonify = require('../actions/effect/Cartoonify.cjs');
var actions_effect_Outline = require('../actions/effect/Outline.cjs');
var actions_effect_leveled_Blackwhite = require('../actions/effect/leveled/Blackwhite.cjs');
var actions_effect_leveled_Accelerate = require('../actions/effect/leveled/Accelerate.cjs');
var actions_effect_leveled_Loop = require('../actions/effect/leveled/Loop.cjs');
var actions_effect_leveled_MakeTransparent = require('../actions/effect/leveled/MakeTransparent.cjs');
var actions_effect_Dither = require('../actions/effect/Dither.cjs');
var actions_effect_Vectorize = require('../actions/effect/Vectorize.cjs');
var actions_effect_GradientFade = require('../actions/effect/GradientFade.cjs');
var actions_effect_AssistColorBlind = require('../actions/effect/AssistColorBlind.cjs');
var actions_effect_SimulateColorBlind = require('../actions/effect/SimulateColorBlind.cjs');
var actions_effect_leveled_Deshake = require('../actions/effect/leveled/Deshake.cjs');
var actions_effect_pixelate_Pixelate = require('../actions/effect/pixelate/Pixelate.cjs');
var actions_effect_blur_Blur = require('../actions/effect/blur/Blur.cjs');
var actions_adjust_ImproveAction = require('../actions/adjust/ImproveAction.cjs');
var actions_delivery_DeliveryDPRAction = require('../actions/delivery/DeliveryDPRAction.cjs');
var actions_videoEdit_ConcatenateAction = require('../actions/videoEdit/ConcatenateAction.cjs');
var actions_videoEdit_PreviewAction = require('../actions/videoEdit/PreviewAction.cjs');
var actions_videoEdit_TrimAction = require('../actions/videoEdit/TrimAction.cjs');
var actions_videoEdit_VolumeAction = require('../actions/videoEdit/VolumeAction.cjs');
var actions_layer_LayerAction = require('../actions/layer/LayerAction.cjs');
var actions_transcode_KeyframeIntervalsAction = require('../actions/transcode/KeyframeIntervalsAction.cjs');
var actions_transcode_FPSAction = require('../actions/transcode/FPSAction.cjs');
var actions_transcode_BitRateAction = require('../actions/transcode/BitRateAction.cjs');
var actions_transcode_AudioCodecAction = require('../actions/transcode/AudioCodecAction.cjs');
var actions_transcode_AudioFrequencyAction = require('../actions/transcode/AudioFrequencyAction.cjs');
var actions_transcode_StreamingProfile = require('../actions/transcode/StreamingProfile.cjs');
var actions_transcode_ToAnimatedAction = require('../actions/transcode/ToAnimatedAction.cjs');
var actions_effect_leveled_FadeIn = require('../actions/effect/leveled/FadeIn.cjs');
var actions_effect_leveled_FadeOut = require('../actions/effect/leveled/FadeOut.cjs');
var actions_transcode_VideoCodecAction = require('../actions/transcode/VideoCodecAction.cjs');
var actions_conditional = require('../actions/conditional.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../actions/resize/ResizeSimpleAction.cjs');
require('./qualifier/Qualifier.cjs');
require('./qualifier/QualifierValue.cjs');
require('./models/QualifierModel.cjs');
require('./models/qualifierToJson.cjs');
require('./Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('./utils/dataStructureUtils.cjs');
require('./models/ActionModel.cjs');
require('./models/actionToJson.cjs');
require('./utils/toFloatAsString.cjs');
require('../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../qualifiers/flag.cjs');
require('./internalConstants.cjs');
require('./utils/objectFlip.cjs');
require('../qualifiers/gravity/GravityQualifier.cjs');
require('../actions/background/actions/BackgroundColor.cjs');
require('./utils/prepareColor.cjs');
require('./RawAction.cjs');
require('./models/IErrorObject.cjs');
require('../actions/resize/ResizeAdvancedAction.cjs');
require('./models/createGravityModel.cjs');
require('../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../qualifiers/gravity.cjs');
require('../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('./models/createGravityFromModel.cjs');
require('../qualifiers/focusOn.cjs');
require('../qualifiers/autoFocus.cjs');
require('../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');
require('./models/createBackgroundModel.cjs');
require('../qualifiers/background/shared/BlurredBackgroundAction.cjs');
require('../qualifiers/background/shared/base/BackgroundQualifier.cjs');
require('../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.cjs');
require('../qualifiers/background/shared/base/BaseCommonBackground.cjs');
require('../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
require('../qualifiers/background/shared/base/BaseGradientBackground.cjs');
require('../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
require('../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
require('./models/createBackgroundFromModel.cjs');
require('../qualifiers/rotate/RotationModeQualifierValue.cjs');
require('../qualifiers/region/CustomRegion.cjs');
require('../qualifiers/region/NamedRegion.cjs');
require('../qualifiers/position/PositionQualifier.cjs');
require('../qualifiers/gradientDirection/GradientDirectionQualifierValue.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/expression/ExpressionQualifier.cjs');
require('../qualifiers/background.cjs');
require('../qualifiers/animatedFormat/AnimatedFormatQualifierValue.cjs');
require('../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../qualifiers/source/BaseSource.cjs');
require('../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../qualifiers/source/sourceTypes/SubtitlesSource.cjs');
require('../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../qualifiers/textStyle.cjs');
require('../qualifiers/fontWeight.cjs');
require('../qualifiers/fontStyle.cjs');
require('../qualifiers/textDecoration.cjs');
require('./utils/serializeCloudinaryCharacters.cjs');
require('../qualifiers/textStroke.cjs');
require('./models/IStrokeModel.cjs');
require('../qualifiers/source/sourceTypes/FetchSource.cjs');
require('./utils/base64Encode.cjs');
require('../qualifiers/source/sourceTypes/TextSource.cjs');
require('./models/createTextStyleFromModel.cjs');
require('../qualifiers/colorSpace.cjs');
require('../actions/delivery/DeliveryAction.cjs');
require('../qualifiers/progressive.cjs');
require('../actions/effect/EffectActions/LeveledEffectAction.cjs');
require('../qualifiers/region.cjs');
require('./models/createSourceFromModel.cjs');
require('./models/IImageSourceModel.cjs');
require('./models/IFetchSourceModel.cjs');
require('./models/ITextSourceModel.cjs');
require('../qualifiers/blendMode/BlendModeQualifier.cjs');
require('./models/createPositionFromModel.cjs');
require('./models/createTimelinePositionFromModel.cjs');
require('../qualifiers/video/TimelinePosition.cjs');
require('../actions/transcode/FPSRangeAction.cjs');
require('../qualifiers/videoCodecType/VideoCodecType.cjs');
require('../qualifiers/videoCodec.cjs');
require('../qualifiers/expression.cjs');

var ActionModelMap = {
    scale: actions_resize_ResizeScaleAction.ResizeScaleAction,
    fit: actions_resize_ResizeFitAction.ResizeFitAction,
    limitFit: actions_resize_ResizeLimitFitAction.ResizeLimitFitAction,
    minimumFit: actions_resize_ResizeMinimumFitAction.ResizeMinimumFitAction,
    crop: actions_resize_ResizeCropAction.ResizeCropAction,
    fill: actions_resize_ResizeFillAction.ResizeFillAction,
    limitFill: actions_resize_ResizeLimitFillAction.ResizeLimitFillAction,
    thumbnail: actions_resize_ThumbnailAction.ThumbResizeAction,
    pad: actions_resize_ResizePadAction.ResizePadAction,
    limitPad: actions_resize_ResizeLimitPadAction.ResizeLimitPadAction,
    minimumPad: actions_resize_ResizeMinimumPadAction.ResizeMinimumPadAction,
    colorSpace: actions_delivery_DeliveryColorSpaceAction.DeliveryColorSpaceAction,
    colorSpaceFromICC: actions_delivery_DeliveryColorSpaceFromICCAction.DeliveryColorSpaceFromICCAction,
    format: actions_delivery_DeliveryFormatAction.DeliveryFormatAction,
    quality: actions_delivery_DeliveryQualityAction.DeliveryQualityAction,
    sepia: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    boomerang: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    grayscale: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    advancedRedEye: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    negate: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    redEye: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    reverse: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    transition: actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction,
    shadow: actions_effect_Shadow.ShadowEffectAction,
    colorize: actions_effect_Colorize.ColorizeEffectAction,
    oilPaint: actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength,
    cartoonify: actions_effect_Cartoonify.CartoonifyEffect,
    outline: actions_effect_Outline.EffectOutline,
    blackwhite: actions_effect_leveled_Blackwhite.BlackwhiteEffectAction,
    accelerate: actions_effect_leveled_Accelerate.AccelerationEffectAction,
    loop: actions_effect_leveled_Loop.LoopEffectAction,
    makeTransparent: actions_effect_leveled_MakeTransparent.MakeTransparentEffectAction,
    noise: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    vignette: actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength,
    dither: actions_effect_Dither.DitherEffectAction,
    vectorize: actions_effect_Vectorize.VectorizeEffectAction,
    gradientFade: actions_effect_GradientFade.GradientFadeEffectAction,
    assistColorblind: actions_effect_AssistColorBlind.AssistColorBlindEffectAction,
    simulateColorblind: actions_effect_SimulateColorBlind.SimulateColorBlindEffectAction,
    deshake: actions_effect_leveled_Deshake.DeshakeEffectAction,
    pixelate: actions_effect_pixelate_Pixelate.Pixelate,
    blur: actions_effect_blur_Blur.BlurAction,
    improve: actions_adjust_ImproveAction.ImproveAction,
    unsharpMask: actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength,
    saturation: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    dpr: actions_delivery_DeliveryDPRAction.DeliveryDPRAction,
    contrast: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    brightness: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    gamma: actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel,
    concatenate: actions_videoEdit_ConcatenateAction,
    preview: actions_videoEdit_PreviewAction.PreviewAction,
    trimVideo: actions_videoEdit_TrimAction,
    volume: actions_videoEdit_VolumeAction,
    overlay: actions_layer_LayerAction.LayerAction,
    underlay: actions_layer_LayerAction.LayerAction,
    keyframeInterval: actions_transcode_KeyframeIntervalsAction,
    fps: actions_transcode_FPSAction,
    bitRate: actions_transcode_BitRateAction,
    audioCodec: actions_transcode_AudioCodecAction,
    audioFrequency: actions_transcode_AudioFrequencyAction,
    streamingProfile: actions_transcode_StreamingProfile,
    toAnimated: actions_transcode_ToAnimatedAction,
    fadeIn: actions_effect_leveled_FadeIn.FadeInEffectAction,
    fadeOut: actions_effect_leveled_FadeOut.FadeOutEffectAction,
    videoCodec: actions_transcode_VideoCodecAction.VideoCodecAction,
    ifCondition: actions_conditional.ConditionalAction
};
/**
 * Convert actions models to actions.
 * @throws UnsupportedError if encounters an unsupported action.
 * @param actionModels
 */
function actions(actionModels) {
    return actionModels.map(function (actionModel) {
        var actionClass = (ActionModelMap[actionModel.actionType]);
        if (!actionClass) {
            throw internal_utils_unsupportedError.createUnsupportedError("unsupported action " + actionModel.actionType);
        }
        return actionClass.fromJson(actionModel, fromJson);
    });
}
/**
 * Return array of action instances represented by given action models.
 * @param transformationModel
 */
function fromJson(transformationModel) {
    try {
        // Create a new Transformation and add all actions to it
        var transformation_1 = new transformation_Transformation.Transformation();
        actions(transformationModel.actions).forEach(function (action) { return transformation_1.addAction(action); });
        return transformation_1;
    }
    catch (error) {
        return { error: error };
    }
}

exports.fromJson = fromJson;
