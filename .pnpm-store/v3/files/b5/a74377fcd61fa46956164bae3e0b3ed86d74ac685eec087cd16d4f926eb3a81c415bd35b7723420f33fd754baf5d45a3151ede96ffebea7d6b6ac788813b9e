import { generateTransformationString } from "./generateTransformationString.js";
import { finalize_resource_type } from "./utils/finalizeResourceType.js";
import { finalize_source } from "./utils/finalize_source.js";
import { unsigned_url_prefix } from "./utils/unsigned_url_prefix.js";
import { cloneDeep } from '../internal/utils/cloneDeep.js';
export function createCloudinaryLegacyURL(public_id, transformationOptions) {
    // Path format
    if (transformationOptions.type === "fetch") {
        if (transformationOptions.fetch_format == null) {
            transformationOptions.fetch_format = transformationOptions.format;
        }
    }
    let source_to_sign;
    let type = transformationOptions.type;
    let resource_type = transformationOptions.resource_type || 'image';
    let version = transformationOptions.version;
    const force_version = typeof transformationOptions.force_version === 'boolean' ? transformationOptions.force_version : true;
    const long_url_signature = !!transformationOptions.long_url_signature;
    const format = transformationOptions.format;
    const cloud_name = transformationOptions.cloud_name;
    if (!cloud_name) {
        throw "cloud_name must be provided in the configuration";
    }
    const private_cdn = transformationOptions.private_cdn;
    const secure_distribution = transformationOptions.secure_distribution;
    const secure = transformationOptions.secure;
    const cdn_subdomain = transformationOptions.cdn_subdomain;
    const secure_cdn_subdomain = transformationOptions.secure_cdn_subdomain;
    const cname = transformationOptions.cname;
    const shorten = transformationOptions.shorten;
    const sign_url = transformationOptions.sign_url;
    const api_secret = transformationOptions.api_secret;
    const url_suffix = transformationOptions.url_suffix;
    const use_root_path = transformationOptions.use_root_path;
    const auth_token = transformationOptions.auth_token;
    const preloaded = /^(image|raw)\/([a-z0-9_]+)\/v(\d+)\/([^#]+)$/.exec(public_id);
    if (preloaded) {
        resource_type = preloaded[1];
        type = preloaded[2];
        version = preloaded[3];
        public_id = preloaded[4];
    }
    const original_source = public_id;
    if (public_id == null) {
        return original_source;
    }
    public_id = public_id.toString();
    if (type === null && public_id.match(/^https?:\//i)) {
        return original_source;
    }
    [resource_type, type] = finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten);
    [public_id, source_to_sign] = finalize_source(public_id, format, url_suffix);
    if (version == null && force_version && source_to_sign.indexOf("/") >= 0 && !source_to_sign.match(/^v[0-9]+/) && !source_to_sign.match(/^https?:\//)) {
        version = 1;
    }
    if (version != null) {
        version = `v${version}`;
    }
    else {
        version = null;
    }
    const transformation = generateTransformationString(cloneDeep(transformationOptions)).replace(/([^:])\/\//g, '$1/');
    ;
    if (sign_url && !auth_token) {
        let to_sign = [transformation, source_to_sign].filter(function (part) {
            return (part != null) && part !== '';
        }).join('/');
        try {
            for (let i = 0; to_sign !== decodeURIComponent(to_sign) && i < 10; i++) {
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
    const prefix = unsigned_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution);
    const resultUrl = [prefix, resource_type, type, transformation, version, public_id].filter(function (part) {
        return (part != null) && part !== '';
    }).join('/').replace(' ', '%20');
    return resultUrl;
}
