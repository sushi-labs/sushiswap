import { OLD_AKAMAI_SHARED_CDN, SHARED_CDN } from "../consts.js";
export function unsigned_url_prefix(source, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution) {
    let prefix;
    if (cloud_name.indexOf("/") === 0) {
        return '/res' + cloud_name;
    }
    let shared_domain = !private_cdn;
    if (secure) {
        if ((secure_distribution == null) || secure_distribution === OLD_AKAMAI_SHARED_CDN) {
            secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : SHARED_CDN;
        }
        if (shared_domain == null) {
            shared_domain = secure_distribution === SHARED_CDN;
        }
        prefix = 'https://' + secure_distribution;
    }
    else if (cname) {
        // let subdomain = cdn_subdomain ? 'a' + ((crc32(source) % 5) + 1) + '.' : '';
        prefix = 'http://' + cname;
    }
    else {
        let cdn_part = private_cdn ? cloud_name + '-' : '';
        let host = [cdn_part, 'res', '.cloudinary.com'].join('');
        prefix = 'http://' + host;
    }
    if (shared_domain) {
        prefix += '/' + cloud_name;
    }
    return prefix;
}
