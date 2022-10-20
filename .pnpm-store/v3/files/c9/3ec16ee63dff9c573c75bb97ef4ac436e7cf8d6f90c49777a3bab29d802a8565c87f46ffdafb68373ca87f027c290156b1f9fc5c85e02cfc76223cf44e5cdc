'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_consts = require('../consts.cjs');

function unsigned_url_prefix(source, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution) {
    var prefix;
    if (cloud_name.indexOf("/") === 0) {
        return '/res' + cloud_name;
    }
    var shared_domain = !private_cdn;
    if (secure) {
        if ((secure_distribution == null) || secure_distribution === backwards_consts.OLD_AKAMAI_SHARED_CDN) {
            secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : backwards_consts.SHARED_CDN;
        }
        if (shared_domain == null) {
            shared_domain = secure_distribution === backwards_consts.SHARED_CDN;
        }
        prefix = 'https://' + secure_distribution;
    }
    else if (cname) {
        // let subdomain = cdn_subdomain ? 'a' + ((crc32(source) % 5) + 1) + '.' : '';
        prefix = 'http://' + cname;
    }
    else {
        var cdn_part = private_cdn ? cloud_name + '-' : '';
        var host = [cdn_part, 'res', '.cloudinary.com'].join('');
        prefix = 'http://' + host;
    }
    if (shared_domain) {
        prefix += '/' + cloud_name;
    }
    return prefix;
}

exports.unsigned_url_prefix = unsigned_url_prefix;
