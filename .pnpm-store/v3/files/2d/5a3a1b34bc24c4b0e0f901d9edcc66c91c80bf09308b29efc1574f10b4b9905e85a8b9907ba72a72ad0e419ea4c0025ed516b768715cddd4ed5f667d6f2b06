"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.UrlSetBuilder = void 0;
var array_js_1 = require("../utils/array.js");
var defaults_js_1 = require("../utils/defaults.js");
var url_js_1 = require("../utils/url.js");
var UrlSetBuilder = /** @class */ (function () {
    function UrlSetBuilder(config, manifest) {
        this.config = config;
        this.manifest = manifest;
    }
    /**
     * Returns absolute url by combining siteUrl and path w.r.t trailingSlash config
     * @param siteUrl
     * @param path
     * @param trailingSlash
     * @returns
     */
    UrlSetBuilder.prototype.absoluteUrl = function (siteUrl, path, trailingSlash) {
        var url = (0, url_js_1.generateUrl)(siteUrl, trailingSlash ? "".concat(path, "/") : path);
        if (!trailingSlash && url.endsWith('/')) {
            return url.slice(0, url.length - 1);
        }
        return (0, url_js_1.entityEscapedUrl)(url);
    };
    /**
     * Normalize sitemap fields to include absolute urls
     * @param field
     */
    UrlSetBuilder.prototype.normalizeSitemapField = function (field) {
        var _this = this;
        var _a, _b, _c;
        // Handle trailing Slash
        var trailingSlash = 'trailingSlash' in field
            ? field.trailingSlash
            : (_a = this.config) === null || _a === void 0 ? void 0 : _a.trailingSlash;
        return __assign(__assign({}, field), { trailingSlash: trailingSlash, loc: this.absoluteUrl((_b = this.config) === null || _b === void 0 ? void 0 : _b.siteUrl, field === null || field === void 0 ? void 0 : field.loc, trailingSlash), alternateRefs: ((_c = field.alternateRefs) !== null && _c !== void 0 ? _c : []).map(function (alternateRef) { return ({
                href: alternateRef.hrefIsAbsolute
                    ? alternateRef.href
                    : _this.absoluteUrl(alternateRef.href, field.loc, trailingSlash),
                hreflang: alternateRef.hreflang
            }); }) });
    };
    /**
     * Create a unique url set
     */
    UrlSetBuilder.prototype.createUrlSet = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return __awaiter(this, void 0, void 0, function () {
            var i18n, allKeys, urlSet, defaultLocale, replaceDefaultLocale, notFoundRoutes, sitemapFields, mapFieldsByLoc, urlSet_1, urlSet_1_1, url, sitemapField, e_1_1, additions, _loop_1, additions_1, additions_1_1, field;
            var e_1, _y, e_2, _z;
            var _this = this;
            return __generator(this, function (_0) {
                switch (_0.label) {
                    case 0:
                        i18n = (_b = (_a = this.manifest) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.i18n;
                        allKeys = __spreadArray(__spreadArray(__spreadArray([], __read(Object.keys((_c = this.manifest) === null || _c === void 0 ? void 0 : _c.build.pages)), false), __read(((_f = (_e = (_d = this.manifest) === null || _d === void 0 ? void 0 : _d.build) === null || _e === void 0 ? void 0 : _e.ampFirstPages) !== null && _f !== void 0 ? _f : [])), false), __read((((_g = this.manifest) === null || _g === void 0 ? void 0 : _g.preRender)
                            ? Object.keys((_h = this.manifest) === null || _h === void 0 ? void 0 : _h.preRender.routes)
                            : [])), false);
                        urlSet = allKeys.filter(function (x) { return !(0, url_js_1.isNextInternalUrl)(x); });
                        // Remove default locale if i18n is enabled
                        if (i18n) {
                            defaultLocale = i18n.defaultLocale;
                            replaceDefaultLocale = (0, url_js_1.createDefaultLocaleReplace)(defaultLocale);
                            urlSet = urlSet.map(replaceDefaultLocale);
                        }
                        // Remove the urls based on this.config?.exclude array
                        if (((_j = this.config) === null || _j === void 0 ? void 0 : _j.exclude) && ((_k = this.config) === null || _k === void 0 ? void 0 : _k.exclude.length) > 0) {
                            urlSet = (0, array_js_1.removeIfMatchPattern)(urlSet, (_l = this.config) === null || _l === void 0 ? void 0 : _l.exclude);
                        }
                        urlSet = __spreadArray([], __read(new Set(urlSet)), false);
                        notFoundRoutes = ((_p = (_o = (_m = this.manifest) === null || _m === void 0 ? void 0 : _m.preRender) === null || _o === void 0 ? void 0 : _o.notFoundRoutes) !== null && _p !== void 0 ? _p : []);
                        urlSet = urlSet.filter(function (url) { return !notFoundRoutes.includes(url); });
                        sitemapFields = [] // transform using relative urls
                        ;
                        mapFieldsByLoc = {};
                        _0.label = 1;
                    case 1:
                        _0.trys.push([1, 6, 7, 8]);
                        urlSet_1 = __values(urlSet), urlSet_1_1 = urlSet_1.next();
                        _0.label = 2;
                    case 2:
                        if (!!urlSet_1_1.done) return [3 /*break*/, 5];
                        url = urlSet_1_1.value;
                        return [4 /*yield*/, ((_r = (_q = this.config) === null || _q === void 0 ? void 0 : _q.transform) === null || _r === void 0 ? void 0 : _r.call(_q, this.config, url))];
                    case 3:
                        sitemapField = _0.sent();
                        if (!(sitemapField === null || sitemapField === void 0 ? void 0 : sitemapField.loc))
                            return [3 /*break*/, 4];
                        sitemapFields.push(sitemapField);
                        // Add link on field to map by loc
                        if ((_s = this.config) === null || _s === void 0 ? void 0 : _s.additionalPaths) {
                            mapFieldsByLoc[sitemapField.loc] = sitemapField;
                        }
                        _0.label = 4;
                    case 4:
                        urlSet_1_1 = urlSet_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _0.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (urlSet_1_1 && !urlSet_1_1.done && (_y = urlSet_1["return"])) _y.call(urlSet_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if (!((_t = this.config) === null || _t === void 0 ? void 0 : _t.additionalPaths)) return [3 /*break*/, 10];
                        return [4 /*yield*/, ((_u = this.config) === null || _u === void 0 ? void 0 : _u.additionalPaths(__assign(__assign({}, this.config), { transform: (_w = (_v = this.config) === null || _v === void 0 ? void 0 : _v.transform) !== null && _w !== void 0 ? _w : defaults_js_1.defaultSitemapTransformer })))];
                    case 9:
                        additions = (_x = (_0.sent())) !== null && _x !== void 0 ? _x : [];
                        _loop_1 = function (field) {
                            if (!(field === null || field === void 0 ? void 0 : field.loc))
                                return "continue";
                            var collision = mapFieldsByLoc[field.loc];
                            // Update first entry
                            if (collision) {
                                // Mutate common entry between sitemapFields and mapFieldsByLoc (spread operator don't work)
                                Object.entries(field).forEach(function (_a) {
                                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                                    return (collision[key] = value);
                                });
                                return "continue";
                            }
                            sitemapFields.push(field);
                        };
                        try {
                            for (additions_1 = __values(additions), additions_1_1 = additions_1.next(); !additions_1_1.done; additions_1_1 = additions_1.next()) {
                                field = additions_1_1.value;
                                _loop_1(field);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (additions_1_1 && !additions_1_1.done && (_z = additions_1["return"])) _z.call(additions_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        _0.label = 10;
                    case 10: return [2 /*return*/, sitemapFields.map(function (x) { return _this.normalizeSitemapField(x); })];
                }
            });
        });
    };
    return UrlSetBuilder;
}());
exports.UrlSetBuilder = UrlSetBuilder;
