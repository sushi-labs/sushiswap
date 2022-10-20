"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
exports.__esModule = true;
var defaults_js_1 = require("../defaults.js");
describe('next-sitemap/defaults', function () {
    test('defaultConfig', function () {
        expect(defaults_js_1.defaultConfig).toStrictEqual({
            sourceDir: '.next',
            outDir: 'public',
            sitemapBaseFileName: 'sitemap',
            generateIndexSitemap: true,
            priority: 0.7,
            changefreq: 'daily',
            sitemapSize: 5000,
            autoLastmod: true,
            exclude: [],
            transform: defaults_js_1.defaultSitemapTransformer,
            robotsTxtOptions: {
                transformRobotsTxt: defaults_js_1.defaultRobotsTxtTransformer,
                policies: [
                    {
                        userAgent: '*',
                        allow: '/'
                    },
                ],
                additionalSitemaps: []
            }
        });
    });
    test('withDefaultConfig', function () {
        var myConfig = (0, defaults_js_1.withDefaultConfig)({
            sourceDir: 'custom-source',
            generateRobotsTxt: true,
            generateIndexSitemap: true,
            sitemapSize: 50000,
            exclude: ['1', '2'],
            robotsTxtOptions: {
                policies: [],
                additionalSitemaps: [
                    'https://example.com/awesome-sitemap.xml',
                    'https://example.com/awesome-sitemap-2.xml',
                ]
            }
        });
        expect(myConfig).toStrictEqual({
            sourceDir: 'custom-source',
            outDir: 'public',
            sitemapBaseFileName: 'sitemap',
            generateIndexSitemap: true,
            priority: 0.7,
            changefreq: 'daily',
            sitemapSize: 50000,
            autoLastmod: true,
            generateRobotsTxt: true,
            exclude: ['1', '2'],
            transform: defaults_js_1.defaultSitemapTransformer,
            robotsTxtOptions: {
                transformRobotsTxt: defaults_js_1.defaultRobotsTxtTransformer,
                policies: [],
                additionalSitemaps: [
                    'https://example.com/awesome-sitemap.xml',
                    'https://example.com/awesome-sitemap-2.xml',
                ]
            }
        });
    });
    test('withDefaultConfig: Default transformation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var myConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myConfig = (0, defaults_js_1.withDefaultConfig)({
                        trailingSlash: false,
                        sourceDir: 'custom-source',
                        generateRobotsTxt: true,
                        generateIndexSitemap: true,
                        sitemapSize: 50000,
                        exclude: ['1', '2'],
                        priority: 0.6,
                        changefreq: 'weekly',
                        robotsTxtOptions: {
                            policies: [],
                            additionalSitemaps: [
                                'https://example.com/awesome-sitemap.xml',
                                'https://example.com/awesome-sitemap-2.xml',
                            ]
                        }
                    });
                    // Default transform
                    return [4 /*yield*/, expect(myConfig.transform(myConfig, 'https://example.com')).resolves.toStrictEqual({
                            loc: 'https://example.com',
                            lastmod: expect.any(String),
                            changefreq: 'weekly',
                            priority: 0.6,
                            alternateRefs: [],
                            trailingSlash: myConfig.trailingSlash
                        })
                        // Default transform with custom config override
                    ];
                case 1:
                    // Default transform
                    _a.sent();
                    // Default transform with custom config override
                    return [4 /*yield*/, expect(myConfig.transform(__assign(__assign({}, myConfig), { trailingSlash: true }), 'https://example.com')).resolves.toStrictEqual({
                            loc: 'https://example.com',
                            lastmod: expect.any(String),
                            changefreq: 'weekly',
                            priority: 0.6,
                            alternateRefs: [],
                            trailingSlash: true
                        })];
                case 2:
                    // Default transform with custom config override
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('withDefaultConfig: Custom transformation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var myConfig, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myConfig = (0, defaults_js_1.withDefaultConfig)({
                        sourceDir: 'custom-source',
                        generateRobotsTxt: true,
                        sitemapSize: 50000,
                        exclude: ['1', '2'],
                        priority: 0.6,
                        changefreq: 'weekly',
                        transform: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, {
                                        loc: 'something-else',
                                        lastmod: 'lastmod-cutom'
                                    }];
                            });
                        }); },
                        robotsTxtOptions: {
                            transformRobotsTxt: defaults_js_1.defaultRobotsTxtTransformer,
                            policies: [],
                            additionalSitemaps: [
                                'https://example.com/awesome-sitemap.xml',
                                'https://example.com/awesome-sitemap-2.xml',
                            ]
                        }
                    });
                    return [4 /*yield*/, myConfig.transform(myConfig, 'https://example.com')];
                case 1:
                    value = _a.sent();
                    expect(value).toStrictEqual({
                        loc: 'something-else',
                        lastmod: 'lastmod-cutom'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
