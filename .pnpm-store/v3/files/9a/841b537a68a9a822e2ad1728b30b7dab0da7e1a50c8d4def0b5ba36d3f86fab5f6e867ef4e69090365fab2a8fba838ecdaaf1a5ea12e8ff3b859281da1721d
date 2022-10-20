'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_generateTransformationString = require('./generateTransformationString.cjs');
var backwards_utils_finalizeResourceType = require('./utils/finalizeResourceType.cjs');
var backwards_utils_finalize_source = require('./utils/finalize_source.cjs');
var backwards_utils_unsigned_url_prefix = require('./utils/unsigned_url_prefix.cjs');
var internal_utils_cloneDeep = require('../internal/utils/cloneDeep.cjs');
require('./transformationProcessing/processLayer.cjs');
require('./utils/isObject.cjs');
require('../internal/utils/base64Encode.cjs');
require('./consts.cjs');
require('./utils/smartEscape.cjs');
require('./legacyLayer/textlayer.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./legacyLayer/layer.cjs');
require('./utils/snakeCase.cjs');
require('./utils/isEmpty.cjs');
require('./utils/isNumberLike.cjs');
require('./transformationProcessing/processIf.cjs');
require('./utils/legacyNormalizeExpression.cjs');
require('./utils/toArray.cjs');
require('./transformationProcessing/processRadius.cjs');
require('./transformationProcessing/processCustomFunction.cjs');
require('./transformationProcessing/processCustomPreFunction.cjs');
require('./utils/splitRange.cjs');
require('./utils/norm_range_values.cjs');
require('./transformationProcessing/processVideoParams.cjs');
require('./transformation.cjs');
require('./condition.cjs');
require('./expression.cjs');
require('./configuration.cjs');
require('./utils/legacyBaseUtil.cjs');
require('./legacyLayer/subtitleslayer.cjs');
require('./legacyLayer/fetchlayer.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('./utils/isFunction.cjs');
require('./transformationProcessing/processDpr.cjs');

function createCloudinaryLegacyURL(public_id, transformationOptions) {
    var _a, _b;
    // Path format
    if (transformationOptions.type === "fetch") {
        if (transformationOptions.fetch_format == null) {
            transformationOptions.fetch_format = transformationOptions.format;
        }
    }
    var source_to_sign;
    var type = transformationOptions.type;
    var resource_type = transformationOptions.resource_type || 'image';
    var version = transformationOptions.version;
    var force_version = typeof transformationOptions.force_version === 'boolean' ? transformationOptions.force_version : true;
    !!transformationOptions.long_url_signature;
    var format = transformationOptions.format;
    var cloud_name = transformationOptions.cloud_name;
    if (!cloud_name) {
        throw "cloud_name must be provided in the configuration";
    }
    var private_cdn = transformationOptions.private_cdn;
    var secure_distribution = transformationOptions.secure_distribution;
    var secure = transformationOptions.secure;
    var cdn_subdomain = transformationOptions.cdn_subdomain;
    var secure_cdn_subdomain = transformationOptions.secure_cdn_subdomain;
    var cname = transformationOptions.cname;
    var shorten = transformationOptions.shorten;
    var sign_url = transformationOptions.sign_url;
    transformationOptions.api_secret;
    var url_suffix = transformationOptions.url_suffix;
    var use_root_path = transformationOptions.use_root_path;
    var auth_token = transformationOptions.auth_token;
    var preloaded = /^(image|raw)\/([a-z0-9_]+)\/v(\d+)\/([^#]+)$/.exec(public_id);
    if (preloaded) {
        resource_type = preloaded[1];
        type = preloaded[2];
        version = preloaded[3];
        public_id = preloaded[4];
    }
    var original_source = public_id;
    if (public_id == null) {
        return original_source;
    }
    public_id = public_id.toString();
    if (type === null && public_id.match(/^https?:\//i)) {
        return original_source;
    }
    _a = backwards_utils_finalizeResourceType.finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten), resource_type = _a[0], type = _a[1];
    _b = backwards_utils_finalize_source.finalize_source(public_id, format, url_suffix), public_id = _b[0], source_to_sign = _b[1];
    if (version == null && force_version && source_to_sign.indexOf("/") >= 0 && !source_to_sign.match(/^v[0-9]+/) && !source_to_sign.match(/^https?:\//)) {
        version = 1;
    }
    if (version != null) {
        version = "v" + version;
    }
    else {
        version = null;
    }
    var transformation = backwards_generateTransformationString.generateTransformationString(internal_utils_cloneDeep.cloneDeep(transformationOptions)).replace(/([^:])\/\//g, '$1/');
    if (sign_url && !auth_token) {
        var to_sign = [transformation, source_to_sign].filter(function (part) {
            return (part != null) && part !== '';
        }).join('/');
        try {
            for (var i = 0; to_sign !== decodeURIComponent(to_sign) && i < 10; i++) {
                to_sign = decodeURIComponent(to_sign);
            }
            // eslint-disable-next-line no-empty
        }
        catch (error) {
        }
        // No support for Auth Token
        // const shasum = crypto.createHash(long_url_signature ? 'sha256' : 'sha1');
        // shasum.update(utf8_encode(to_sign + api_secret), 'binary');
        // signature = shasum.digest('base64').replace(/\//g, '_').replace(/\+/g, '-').substring(0, long_url_signature ? 32 : 8);
        // signature = `s--${signature}--`;
    }
    var prefix = backwards_utils_unsigned_url_prefix.unsigned_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution);
    var resultUrl = [prefix, resource_type, type, transformation, version, public_id].filter(function (part) {
        return (part != null) && part !== '';
    }).join('/').replace(' ', '%20');
    return resultUrl;
}

exports.createCloudinaryLegacyURL = createCloudinaryLegacyURL;
