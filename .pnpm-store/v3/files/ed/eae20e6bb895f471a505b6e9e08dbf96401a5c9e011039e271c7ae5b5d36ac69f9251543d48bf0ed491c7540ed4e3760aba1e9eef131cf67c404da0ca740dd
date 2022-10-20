"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ExportableBuilder = void 0;
var sitemap_builder_js_1 = require("./sitemap-builder.js");
var node_path_1 = __importDefault(require("node:path"));
var url_js_1 = require("../utils/url.js");
var merge_js_1 = require("../utils/merge.js");
var robots_txt_builder_js_1 = require("./robots-txt-builder.js");
var defaults_js_1 = require("../utils/defaults.js");
var ExportableBuilder = /** @class */ (function () {
    function ExportableBuilder(config, runtimePaths) {
        this.exportableList = [];
        this.config = config;
        this.runtimePaths = runtimePaths;
        this.sitemapBuilder = new sitemap_builder_js_1.SitemapBuilder();
        this.robotsTxtBuilder = new robots_txt_builder_js_1.RobotsTxtBuilder();
        this.exportDir = node_path_1["default"].resolve(process.cwd(), this.config.outDir);
    }
    /**
     * Register sitemap index files
     */
    ExportableBuilder.prototype.registerIndexSitemap = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var sitemaps, content, item;
            return __generator(this, function (_d) {
                sitemaps = __spreadArray(__spreadArray([], __read(this.generatedSitemaps()), false), __read(((_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.robotsTxtOptions) === null || _b === void 0 ? void 0 : _b.additionalSitemaps) !== null && _c !== void 0 ? _c : [])), false);
                content = this.sitemapBuilder.buildSitemapIndexXml(sitemaps);
                item = {
                    type: 'sitemap-index',
                    filename: this.runtimePaths.SITEMAP_INDEX_FILE,
                    url: this.runtimePaths.SITEMAP_INDEX_URL,
                    content: content
                };
                // Add to exportable list
                this.exportableList.push(item);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Resolve filename if index sitemap is generated
     * @param index
     * @returns
     */
    ExportableBuilder.prototype.resolveFilenameWithIndexSitemap = function (index) {
        return "".concat(this.config.sitemapBaseFileName, "-").concat(index, ".xml");
    };
    /**
     * Resolve filename if index sitemaps is not generated
     * @param index
     * @returns
     */
    ExportableBuilder.prototype.resolveFilenameWithoutIndexSitemap = function (index) {
        if (index === 0) {
            return "".concat(this.config.sitemapBaseFileName, ".xml");
        }
        return this.resolveFilenameWithIndexSitemap(index);
    };
    /**
     * Register sitemaps with exportable builder
     * @param chunks
     */
    ExportableBuilder.prototype.registerSitemaps = function (chunks) {
        return __awaiter(this, void 0, void 0, function () {
            var hasIndexSitemap, items;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                hasIndexSitemap = this.config.generateIndexSitemap;
                items = chunks === null || chunks === void 0 ? void 0 : chunks.map(function (chunk, index) {
                    // Get sitemap base filename
                    var baseFilename = hasIndexSitemap
                        ? _this.resolveFilenameWithIndexSitemap(index)
                        : _this.resolveFilenameWithoutIndexSitemap(index);
                    return {
                        type: 'sitemap',
                        url: (0, url_js_1.generateUrl)(_this.config.siteUrl, baseFilename),
                        filename: node_path_1["default"].resolve(_this.exportDir, baseFilename),
                        content: _this.sitemapBuilder.buildSitemapXml(chunk)
                    };
                });
                // Add to exportable list
                (_a = this.exportableList).push.apply(_a, __spreadArray([], __read(items), false));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get robots.txt export config
     * @returns
     */
    ExportableBuilder.prototype.robotsTxtExportConfig = function () {
        var _a, _b;
        // Endpoints list
        var endpoints = [];
        // Include non-index sitemaps
        // Optionally allow user to include non-index sitemaps along with generated sitemap list
        // Set to true if index-sitemap is not generated
        var includeNonIndexSitemaps = this.config.generateIndexSitemap
            ? (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.robotsTxtOptions) === null || _b === void 0 ? void 0 : _b.includeNonIndexSitemaps
            : true;
        // Add all sitemap indices
        if (this.config.generateIndexSitemap) {
            endpoints.push.apply(endpoints, __spreadArray([], __read(this.generatedSitemapIndices()), false));
        }
        // Add all non-index sitemaps
        if (includeNonIndexSitemaps) {
            endpoints.push.apply(endpoints, __spreadArray([], __read(this.generatedSitemaps()), false));
        }
        // Combine merge with additional sitemaps
        return (0, merge_js_1.combineMerge)({
            robotsTxtOptions: {
                additionalSitemaps: endpoints
            }
        }, this.config);
    };
    /**
     * Register robots.txt export
     */
    ExportableBuilder.prototype.registerRobotsTxt = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var baseFilename, robotsConfig, content, robotsTransformer, item;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        baseFilename = 'robots.txt';
                        robotsConfig = this.robotsTxtExportConfig();
                        content = this.robotsTxtBuilder.generateRobotsTxt(robotsConfig);
                        robotsTransformer = (_b = (_a = robotsConfig === null || robotsConfig === void 0 ? void 0 : robotsConfig.robotsTxtOptions) === null || _a === void 0 ? void 0 : _a.transformRobotsTxt) !== null && _b !== void 0 ? _b : defaults_js_1.defaultRobotsTxtTransformer;
                        return [4 /*yield*/, robotsTransformer(robotsConfig, content)
                            // Generate exportable item
                        ];
                    case 1:
                        // Transform generated robots txt
                        content = _c.sent();
                        item = {
                            type: 'robots.txt',
                            filename: node_path_1["default"].resolve(this.exportDir, baseFilename),
                            url: (0, url_js_1.generateUrl)(robotsConfig === null || robotsConfig === void 0 ? void 0 : robotsConfig.siteUrl, baseFilename),
                            content: content
                        };
                        // Add to exportableList
                        this.exportableList.push(item);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generic reducer to extract by type
     * @param condition
     * @returns
     */
    ExportableBuilder.prototype.exportableUrlReducer = function (condition) {
        return this.exportableList.reduce(function (prev, curr) {
            var matches = condition(curr);
            if (matches) {
                prev.push(curr.url);
            }
            return prev;
        }, []);
    };
    /**
     * Return a lit of sitemap urls
     * @returns
     */
    ExportableBuilder.prototype.generatedSitemaps = function () {
        return this.exportableUrlReducer(function (x) { return x.type == 'sitemap'; });
    };
    ExportableBuilder.prototype.generatedSitemapIndices = function () {
        return this.exportableUrlReducer(function (x) { return x.type == 'sitemap-index'; });
    };
    return ExportableBuilder;
}());
exports.ExportableBuilder = ExportableBuilder;
