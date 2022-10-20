"use strict";
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
exports.__esModule = true;
exports.Logger = void 0;
/**
 * Generic console logger
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    /**
     * Missing build
     */
    Logger.noExportMarker = function () {
        Logger.error('Unable to find export-maker.\nMake sure to build the project using `next build` command\n');
    };
    /**
     * Log missing config file
     */
    Logger.noConfigFile = function () {
        Logger.error('Unable to find next-sitemap.config.js or custom config file.\n\nIMPORTANT: Default config file has been renamed to `next-sitemap.config.js`\n\nIf you are using custom config file, make sure to invoke `next-sitemap --config <custom-config-file>.js`\n');
    };
    /**
     * Generic error logger
     * @param text
     * @returns
     */
    Logger.error = function () {
        var text = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            text[_i] = arguments[_i];
        }
        return console.error.apply(console, __spreadArray(["\u001B[31m", "\u274C", "[next-sitemap]"], __read(text), false));
    };
    /**
     * Generic log
     * @param emoji
     * @param text
     */
    Logger.log = function (emoji) {
        var text = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            text[_i - 1] = arguments[_i];
        }
        return console.log.apply(console, __spreadArray([emoji, "[next-sitemap]"], __read(text), false));
    };
    Logger.logList = function (title, list) {
        console.log("-----------------------------------------------------\n", title, "\n-----------------------------------------------------\n");
        // Only show 5 entries on console
        if ((list === null || list === void 0 ? void 0 : list.length) > 7) {
            list = __spreadArray(__spreadArray(__spreadArray([], __read(list.splice(0, 3)), false), ['...'], false), __read(list.splice(list.length - 2, 2)), false);
        }
        // log all sitemap list
        list === null || list === void 0 ? void 0 : list.forEach(function (x) {
            return x === '...' ? console.log("     ".concat(x)) : console.log("   \u25CB ".concat(x));
        });
        console.log("\n");
    };
    /**
     * Log stats when the generation is completed
     * @param result
     * @returns
     */
    Logger.generationCompleted = function (result) {
        // Initial stats
        Logger.log("\u2705", 'Generation completed');
        var indexCount = result.sitemapIndices.length;
        var sitemapCount = result.sitemaps.length;
        console.table({
            indexSitemaps: indexCount,
            sitemaps: sitemapCount
        });
        // Log sitemap index list
        if (indexCount > 0) {
            Logger.logList('SITEMAP INDICES', result.sitemapIndices);
        }
        // Log sitemap list
        if (sitemapCount > 0) {
            Logger.logList('SITEMAPS', result.sitemaps);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
