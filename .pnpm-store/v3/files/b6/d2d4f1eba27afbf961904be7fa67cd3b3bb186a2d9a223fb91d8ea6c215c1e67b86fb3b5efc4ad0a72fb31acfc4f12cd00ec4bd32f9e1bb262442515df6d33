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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.SitemapBuilder = void 0;
/**
 * Builder class to generate xml and robots.txt
 * Returns only string values
 */
var SitemapBuilder = /** @class */ (function () {
    function SitemapBuilder() {
    }
    /**
     * Create XML Template
     * @param content
     * @returns
     */
    SitemapBuilder.prototype.withXMLTemplate = function (content) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:mobile=\"http://www.google.com/schemas/sitemap-mobile/1.0\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\">\n".concat(content, "</urlset>");
    };
    /**
     * Generates sitemap-index.xml
     * @param allSitemaps
     * @returns
     */
    SitemapBuilder.prototype.buildSitemapIndexXml = function (allSitemaps) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n        <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n        ".concat(allSitemaps === null || allSitemaps === void 0 ? void 0 : allSitemaps.map(function (x) { return "<sitemap><loc>".concat(x, "</loc></sitemap>"); }).join('\n'), "\n        </sitemapindex>");
    };
    /**
     * Normalize sitemap field keys to stay consistent with <xsd:sequence> order
     * @link https://www.w3schools.com/xml/el_sequence.asp
     * @link https://github.com/iamvishnusankar/next-sitemap/issues/345
     * @param x
     * @returns
     */
    SitemapBuilder.prototype.normalizeSitemapField = function (x) {
        var loc = x.loc, lastmod = x.lastmod, changefreq = x.changefreq, priority = x.priority, restProps = __rest(x
        // Return keys in following order
        , ["loc", "lastmod", "changefreq", "priority"]);
        // Return keys in following order
        return __assign({ loc: loc, lastmod: lastmod, changefreq: changefreq, priority: priority }, restProps);
    };
    /**
     * Generates sitemap.xml
     * @param fields
     * @returns
     */
    SitemapBuilder.prototype.buildSitemapXml = function (fields) {
        var _this = this;
        var content = fields
            .map(function (x) {
            var e_1, _a;
            // Normalize sitemap field keys to stay consistent with <xsd:sequence> order
            var field = _this.normalizeSitemapField(x);
            // Field array to keep track of properties
            var fieldArr = [];
            try {
                // Iterate all object keys and key value pair to field-set
                for (var _b = __values(Object.keys(field)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    // Skip reserved keys
                    if (['trailingSlash'].includes(key)) {
                        continue;
                    }
                    if (field[key]) {
                        if (key !== 'alternateRefs') {
                            fieldArr.push("<".concat(key, ">").concat(field[key], "</").concat(key, ">"));
                        }
                        else {
                            var altRefField = _this.buildAlternateRefsXml(field.alternateRefs);
                            fieldArr.push(altRefField);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Append previous value and return
            return "<url>".concat(fieldArr.join(''), "</url>\n");
        })
            .join('');
        return this.withXMLTemplate(content);
    };
    /**
     * Generate alternate refs.xml
     * @param alternateRefs
     * @returns
     */
    SitemapBuilder.prototype.buildAlternateRefsXml = function (alternateRefs) {
        if (alternateRefs === void 0) { alternateRefs = []; }
        return alternateRefs
            .map(function (alternateRef) {
            return "<xhtml:link rel=\"alternate\" hreflang=\"".concat(alternateRef.hreflang, "\" href=\"").concat(alternateRef.href, "\"/>");
        })
            .join('');
    };
    return SitemapBuilder;
}());
exports.SitemapBuilder = SitemapBuilder;
