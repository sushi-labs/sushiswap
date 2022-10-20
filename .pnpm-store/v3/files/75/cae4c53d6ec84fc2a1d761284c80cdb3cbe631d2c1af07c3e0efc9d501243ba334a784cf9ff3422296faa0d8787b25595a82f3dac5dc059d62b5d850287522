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
exports.__esModule = true;
exports.CLI = void 0;
var logger_js_1 = require("./logger.js");
var path_js_1 = require("./utils/path.js");
var array_js_1 = require("./utils/array.js");
var config_parser_js_1 = require("./parsers/config-parser.js");
var manifest_parser_js_1 = require("./parsers/manifest-parser.js");
var url_set_builder_js_1 = require("./builders/url-set-builder.js");
var exportable_builder_js_1 = require("./builders/exportable-builder.js");
var file_js_1 = require("./utils/file.js");
var CLI = /** @class */ (function () {
    function CLI() {
    }
    /**
     * Main method
     * @returns
     */
    CLI.prototype.main = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var configParser, config, runtimePaths, manifestParser, manifest, urlSetBuilder, urlSet, chunks, expoBuilder, result;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        configParser = new config_parser_js_1.ConfigParser();
                        return [4 /*yield*/, configParser.loadBaseConfig()
                            // Find the runtime paths using base config
                        ];
                    case 1:
                        config = _b.sent();
                        runtimePaths = (0, path_js_1.getRuntimePaths)(config);
                        return [4 /*yield*/, configParser.withRuntimeConfig(config, runtimePaths)
                            // Create next.js manifest parser instance
                        ];
                    case 2:
                        // Update base config with runtime config
                        config = _b.sent();
                        manifestParser = new manifest_parser_js_1.ManifestParser();
                        return [4 /*yield*/, manifestParser.loadManifest(runtimePaths)
                            // Create UrlSetBuilder instance
                        ];
                    case 3:
                        manifest = _b.sent();
                        urlSetBuilder = new url_set_builder_js_1.UrlSetBuilder(config, manifest);
                        return [4 /*yield*/, urlSetBuilder.createUrlSet()
                            // Split sitemap into multiple files
                        ];
                    case 4:
                        urlSet = _b.sent();
                        chunks = (0, array_js_1.toChunks)(urlSet, config.sitemapSize);
                        expoBuilder = new exportable_builder_js_1.ExportableBuilder(config, runtimePaths);
                        // Register sitemap exports
                        return [4 /*yield*/, expoBuilder.registerSitemaps(chunks)
                            // Register index sitemap if user config allows generation
                        ];
                    case 5:
                        // Register sitemap exports
                        _b.sent();
                        if (!config.generateIndexSitemap) return [3 /*break*/, 7];
                        return [4 /*yield*/, expoBuilder.registerIndexSitemap()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        if (!(config === null || config === void 0 ? void 0 : config.generateRobotsTxt)) return [3 /*break*/, 9];
                        return [4 /*yield*/, expoBuilder.registerRobotsTxt()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: 
                    // Export all files
                    return [4 /*yield*/, Promise.all((_a = expoBuilder.exportableList) === null || _a === void 0 ? void 0 : _a.map(function (item) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (0, file_js_1.exportFile)(item.filename, item.content)];
                        }); }); }))
                        // Create result object
                    ];
                    case 10:
                        // Export all files
                        _b.sent();
                        result = {
                            runtimePaths: runtimePaths,
                            sitemaps: expoBuilder.generatedSitemaps(),
                            sitemapIndices: expoBuilder.generatedSitemapIndices()
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CLI.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.main()
                        // Log result
                    ];
                    case 1:
                        result = _a.sent();
                        // Log result
                        logger_js_1.Logger.generationCompleted(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    return CLI;
}());
exports.CLI = CLI;
