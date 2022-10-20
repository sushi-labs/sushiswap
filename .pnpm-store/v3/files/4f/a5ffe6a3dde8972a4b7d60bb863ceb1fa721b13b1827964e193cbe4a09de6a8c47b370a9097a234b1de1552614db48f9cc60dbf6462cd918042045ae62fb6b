"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalhostUrl = exports.isWsUrl = exports.isHttpUrl = void 0;
const HTTP_REGEX = "^https?:";
const WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
    const matches = url.match(new RegExp(/^\w+:/, "gi"));
    if (!matches || !matches.length)
        return;
    return matches[0];
}
function matchRegexProtocol(url, regex) {
    const protocol = getUrlProtocol(url);
    if (typeof protocol === "undefined")
        return false;
    return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
    return matchRegexProtocol(url, HTTP_REGEX);
}
exports.isHttpUrl = isHttpUrl;
function isWsUrl(url) {
    return matchRegexProtocol(url, WS_REGEX);
}
exports.isWsUrl = isWsUrl;
function isLocalhostUrl(url) {
    return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}
exports.isLocalhostUrl = isLocalhostUrl;
//# sourceMappingURL=url.js.map