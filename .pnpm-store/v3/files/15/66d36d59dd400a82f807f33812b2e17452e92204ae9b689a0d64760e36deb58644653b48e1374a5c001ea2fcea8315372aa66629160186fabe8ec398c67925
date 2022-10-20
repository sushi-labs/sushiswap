'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Based on CGI::unescape. In addition does not escape / :
// smart_escape = (string)->
//  encodeURIComponent(string).replace(/%3A/g, ":").replace(/%2F/g, "/")
function smartEscape(string, unsafe) {
    if (unsafe === void 0) { unsafe = /([^a-zA-Z0-9_.\-\/:]+)/g; }
    return string.replace(unsafe, function (match) {
        return match.split("").map(function (c) {
            return "%" + c.charCodeAt(0).toString(16).toUpperCase();
        }).join("");
    });
}

exports.smartEscape = smartEscape;
