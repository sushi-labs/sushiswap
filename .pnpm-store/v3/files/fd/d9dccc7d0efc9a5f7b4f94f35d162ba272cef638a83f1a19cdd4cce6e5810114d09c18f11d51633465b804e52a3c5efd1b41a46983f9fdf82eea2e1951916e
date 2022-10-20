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
exports.__esModule = true;
exports.RobotsTxtBuilder = void 0;
var array_js_1 = require("../utils/array.js");
var RobotsTxtBuilder = /** @class */ (function () {
    function RobotsTxtBuilder() {
    }
    /**
     * Normalize robots.txt policies
     * @param policies
     * @returns
     */
    RobotsTxtBuilder.prototype.normalizePolicy = function (policies) {
        return policies.map(function (x) {
            var _a, _b;
            return (__assign(__assign({}, x), { allow: (0, array_js_1.toArray)((_a = x.allow) !== null && _a !== void 0 ? _a : []), disallow: (0, array_js_1.toArray)((_b = x.disallow) !== null && _b !== void 0 ? _b : []) }));
        });
    };
    /**
     * Add new policy
     * @param key
     * @param rules
     * @returns
     */
    RobotsTxtBuilder.prototype.addPolicies = function (key, rules) {
        return rules.reduce(function (prev, curr) { return "".concat(prev).concat(key, ": ").concat(curr, "\n"); }, '');
    };
    /**
     * Generates robots.txt content
     * @param config
     * @returns
     */
    RobotsTxtBuilder.prototype.generateRobotsTxt = function (config) {
        var _this = this;
        var _a = config.robotsTxtOptions, additionalSitemaps = _a.additionalSitemaps, policies = _a.policies;
        var normalizedPolices = this.normalizePolicy(policies);
        var content = '';
        normalizedPolices.forEach(function (x) {
            content += "# ".concat(x.userAgent, "\nUser-agent: ").concat(x.userAgent, "\n");
            if (x.allow) {
                content += "".concat(_this.addPolicies('Allow', x.allow));
            }
            if (x.disallow) {
                content += "".concat(_this.addPolicies('Disallow', x.disallow));
            }
            if (x.crawlDelay) {
                content += "Crawl-delay: ".concat(x.crawlDelay, "\n");
            }
            content += '\n';
        });
        // Append host
        content += "# Host\nHost: ".concat(config.siteUrl, "\n");
        if (additionalSitemaps && additionalSitemaps.length > 0) {
            content += "\n# Sitemaps\n";
            additionalSitemaps.forEach(function (x) {
                content += "Sitemap: ".concat(x, "\n");
            });
        }
        return content;
    };
    return RobotsTxtBuilder;
}());
exports.RobotsTxtBuilder = RobotsTxtBuilder;
