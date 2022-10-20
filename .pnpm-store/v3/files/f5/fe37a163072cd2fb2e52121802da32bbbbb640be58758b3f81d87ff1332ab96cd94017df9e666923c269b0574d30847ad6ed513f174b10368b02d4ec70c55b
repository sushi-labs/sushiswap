"use strict";
exports.__esModule = true;
exports.entityEscapedUrl = exports.createDefaultLocaleReplace = exports.isNextInternalUrl = exports.generateUrl = exports.isURL = exports.cleanPath = void 0;
var cleanPath = function (text) {
    return text.replace(/([^:])(\/\/+)/g, '$1/');
};
exports.cleanPath = cleanPath;
var isURL = function (text) {
    // old: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    return /^https?:\/\//i.test(text);
};
exports.isURL = isURL;
var generateUrl = function (baseUrl, slug) {
    return (0, exports.isURL)(slug) ? (0, exports.cleanPath)(slug) : (0, exports.cleanPath)("".concat(baseUrl, "/").concat(slug));
};
exports.generateUrl = generateUrl;
/**
 * Checks whether a url is next.js specific or not
 * @param path path check
 */
var isNextInternalUrl = function (path) {
    return new RegExp(/[^/]*^.[_]|^\/(404|500)$|\/_middleware$|(?:\[)/g).test(path);
};
exports.isNextInternalUrl = isNextInternalUrl;
/**
 * Creates a replace function to replace the default locale
 * Avoids creating the same RegExp within each replace
 *
 * Replaces only if the path does not contain the locale as an actual valid path
 *
 * Given a default locale of en-US it replaces:
 * /en-US -> /
 * /en-US/home -> /home
 * /en-US/home/ -> /home/
 *
 * Does not replace if its actual page
 * /en-USA -> /en-USA
 * /en-USA/home -> /en-USA/home
 * /en-US-home -> /en-US-home
 *
 * @param defaultLocale defaultLocale as provided by i18n within next config
 */
var createDefaultLocaleReplace = function (defaultLocale) {
    var defaultLocaleRegExp = new RegExp("^/".concat(defaultLocale, "($|/)"));
    return function (path) { return path.replace(defaultLocaleRegExp, '/'); };
};
exports.createDefaultLocaleReplace = createDefaultLocaleReplace;
/**
 * Return UTF-8 encoded urls
 * @param path
 * @returns
 * @link https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#general-guidelines
 */
var entityEscapedUrl = function (path) {
    return path
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
};
exports.entityEscapedUrl = entityEscapedUrl;
