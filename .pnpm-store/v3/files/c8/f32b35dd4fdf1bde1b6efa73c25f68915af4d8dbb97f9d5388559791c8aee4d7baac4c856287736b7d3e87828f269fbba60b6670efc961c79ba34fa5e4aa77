'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_source_sourceTypes_BaseTextSource = require('./BaseTextSource.cjs');
require('../BaseSource.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../textStyle.cjs');
require('../../fontWeight.cjs');
require('../../fontStyle.cjs');
require('../../textDecoration.cjs');
require('../../../internal/utils/serializeCloudinaryCharacters.cjs');
require('../../textStroke.cjs');
require('../../../internal/models/IStrokeModel.cjs');
require('../../../internal/Action.cjs');
require('../../flag/FlagQualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/qualifier/Qualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/prepareColor.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.SubtitlesSource}
 * @description Defines how to manipulate a Subtitles layer
 */
var SubtitlesSource = /** @class */ (function (_super) {
    tslib_es6.__extends(SubtitlesSource, _super);
    function SubtitlesSource(fileName) {
        var _this = _super.call(this, fileName) || this;
        _this.type = 'subtitles'; // used within TextSource for l/u_subtitles:
        _this._qualifierModel = {
            sourceType: 'subtitles',
            publicId: fileName
        };
        return _this;
    }
    /**
     * @description Set the textStyle for the subtitles layer
     * @param {TextStyle} textStyle
     */
    SubtitlesSource.prototype.textStyle = function (textStyle) {
        this._textStyle = textStyle;
        this._qualifierModel.textStyle = textStyle.toJson();
        return this;
    };
    /**
     *
     * @description Used within getOpenSourceString of TextSource, this function overwrites the default encoding behaviour
     * Subtitle file names require a different encoding than texts
     * @param text
     * @example
     * encodeText('foo/bar'); // -> foo:bar
     */
    SubtitlesSource.prototype.encodeText = function (text) {
        return text.replace(/\//g, ':');
    };
    return SubtitlesSource;
}(qualifiers_source_sourceTypes_BaseTextSource.BaseTextSource));

exports.SubtitlesSource = SubtitlesSource;
