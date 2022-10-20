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
exports.__esModule = true;
var config_js_1 = require("../../../__fixtures__/config.js");
var manifest_js_1 = require("../../../__fixtures__/manifest.js");
var url_set_builder_js_1 = require("../../url-set-builder.js");
var defaults_js_1 = require("../../../utils/defaults.js");
describe('UrlSetBuilder', function () {
    test('createUrlSet: Without exclusion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(config_js_1.sampleConfig, manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With exclusion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { exclude: ['/', '/page-0', '/page-2'] }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With i18n exclusion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { exclude: ['/', '/page-0', '/page-2', '/about', '/fr*'] }), manifest_js_1.sampleI18nManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With wildcard exclusion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { exclude: ['/page*'] }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: Without trailing slash', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { trailingSlash: false }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With trailing slash', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { trailingSlash: true }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With custom transform', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { trailingSlash: true, transform: function (_, url) {
                            if (!['/', '/page-2'].includes(url)) {
                                return;
                            }
                            return {
                                loc: url,
                                changefreq: 'yearly'
                            };
                        } }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'yearly',
                                loc: 'https://example.com/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                            {
                                changefreq: 'yearly',
                                loc: 'https://example.com/page-2/',
                                alternateRefs: [],
                                trailingSlash: true
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With alternateRefs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { siteUrl: 'https://example.com/', alternateRefs: [
                            { href: 'https://en.example.com/', hreflang: 'en' },
                            { href: 'https://fr.example.com/', hreflang: 'fr' },
                        ] }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [
                                    { href: 'https://en.example.com', hreflang: 'en' },
                                    { href: 'https://fr.example.com', hreflang: 'fr' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0',
                                alternateRefs: [
                                    { href: 'https://en.example.com/page-0', hreflang: 'en' },
                                    { href: 'https://fr.example.com/page-0', hreflang: 'fr' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [
                                    { href: 'https://en.example.com/page-1', hreflang: 'en' },
                                    { href: 'https://fr.example.com/page-1', hreflang: 'fr' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2',
                                alternateRefs: [
                                    { href: 'https://en.example.com/page-2', hreflang: 'en' },
                                    { href: 'https://fr.example.com/page-2', hreflang: 'fr' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [
                                    { href: 'https://en.example.com/page-3', hreflang: 'en' },
                                    { href: 'https://fr.example.com/page-3', hreflang: 'fr' },
                                ],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With absolute alternateRefs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign(__assign({}, config_js_1.sampleConfig), { siteUrl: 'https://example.com/', alternateRefs: [
                            { href: 'https://example.com/en', hreflang: 'en' },
                            { href: 'https://example.com/fr', hreflang: 'fr' },
                            { href: 'https://example.com/it', hreflang: 'it' },
                            { href: 'https://example.com/de', hreflang: 'de' },
                        ], transform: function (config, url) {
                            var sitemapField = {
                                loc: url,
                                changefreq: config.changefreq,
                                priority: config.priority,
                                alternateRefs: config.alternateRefs,
                                lastmod: new Date().toISOString()
                            };
                            if (url.startsWith('/page')) {
                                sitemapField.alternateRefs = [
                                    {
                                        href: 'https://example.com/en',
                                        hreflang: 'en'
                                    },
                                    {
                                        href: 'https://example.com/fr',
                                        hreflang: 'fr'
                                    },
                                    {
                                        href: "https://example.com/it".concat(url.replace('/page', '/pagina')),
                                        hreflang: 'it',
                                        hrefIsAbsolute: true
                                    },
                                    {
                                        href: "https://example.com/de".concat(url.replace('/page', '/seite')),
                                        hreflang: 'de',
                                        hrefIsAbsolute: true
                                    },
                                ];
                            }
                            return sitemapField;
                        } }), manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [
                                    { href: 'https://example.com/en', hreflang: 'en' },
                                    { href: 'https://example.com/fr', hreflang: 'fr' },
                                    { href: 'https://example.com/it', hreflang: 'it' },
                                    { href: 'https://example.com/de', hreflang: 'de' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0',
                                alternateRefs: [
                                    { href: 'https://example.com/en/page-0', hreflang: 'en' },
                                    { href: 'https://example.com/fr/page-0', hreflang: 'fr' },
                                    { href: 'https://example.com/it/pagina-0', hreflang: 'it' },
                                    { href: 'https://example.com/de/seite-0', hreflang: 'de' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [
                                    { href: 'https://example.com/en/page-1', hreflang: 'en' },
                                    { href: 'https://example.com/fr/page-1', hreflang: 'fr' },
                                    { href: 'https://example.com/it/pagina-1', hreflang: 'it' },
                                    { href: 'https://example.com/de/seite-1', hreflang: 'de' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2',
                                alternateRefs: [
                                    { href: 'https://example.com/en/page-2', hreflang: 'en' },
                                    { href: 'https://example.com/fr/page-2', hreflang: 'fr' },
                                    { href: 'https://example.com/it/pagina-2', hreflang: 'it' },
                                    { href: 'https://example.com/de/seite-2', hreflang: 'de' },
                                ],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [
                                    { href: 'https://example.com/en/page-3', hreflang: 'en' },
                                    { href: 'https://example.com/fr/page-3', hreflang: 'fr' },
                                    { href: 'https://example.com/it/pagina-3', hreflang: 'it' },
                                    { href: 'https://example.com/de/seite-3', hreflang: 'de' },
                                ],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With additionalPaths', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transform, mockTransform, config, builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transform = function (config, url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (['/', '/page-0', '/page-1'].includes(url)) {
                                return [2 /*return*/];
                            }
                            if (url === '/additional-page-3') {
                                return [2 /*return*/, {
                                        loc: url,
                                        changefreq: 'yearly',
                                        priority: 0.8
                                    }];
                            }
                            return [2 /*return*/, (0, defaults_js_1.defaultSitemapTransformer)(config, url)];
                        });
                    }); };
                    mockTransform = jest.fn(transform);
                    config = __assign(__assign({}, config_js_1.sampleConfig), { siteUrl: 'https://example.com/', transform: mockTransform, additionalPaths: function (config) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = [{ loc: '/page-1', priority: 1, changefreq: 'yearly' },
                                            { loc: '/page-3', priority: 0.9, changefreq: 'yearly' },
                                            { loc: '/additional-page-1' },
                                            { loc: '/additional-page-2', priority: 1, changefreq: 'yearly' }];
                                        return [4 /*yield*/, config.transform(config, '/additional-page-3')];
                                    case 1: return [2 /*return*/, _a.concat([
                                            _b.sent()
                                        ])];
                                }
                            });
                        }); } });
                    builder = new url_set_builder_js_1.UrlSetBuilder(config, manifest_js_1.sampleManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-2',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'yearly',
                                lastmod: expect.any(String),
                                priority: 0.9,
                                loc: 'https://example.com/page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'yearly',
                                priority: 1,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                loc: 'https://example.com/additional-page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'yearly',
                                priority: 1,
                                loc: 'https://example.com/additional-page-2',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'yearly',
                                priority: 0.8,
                                loc: 'https://example.com/additional-page-3',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ];
                case 1:
                    _a.sent();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    expect(mockTransform.mock.calls.map(function (_a) {
                        var _b = __read(_a, 2), _ = _b[0], url = _b[1];
                        return url;
                    })).toEqual([
                        '/',
                        '/page-0',
                        '/page-1',
                        '/page-2',
                        '/page-3',
                        '/additional-page-3',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With next i18n enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(config_js_1.sampleConfig, manifest_js_1.sampleI18nManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            expect.objectContaining({
                                loc: 'https://example.com'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/about'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/fr'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/fr/about'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/page-0'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/page-1'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/page-2'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/fr/page-2'
                            }),
                            expect.objectContaining({
                                loc: 'https://example.com/page-3'
                            }),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('createUrlSet: With i18n, without notFound routes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    builder = new url_set_builder_js_1.UrlSetBuilder(__assign({}, config_js_1.sampleConfig), manifest_js_1.sampleNotFoundRoutesManifest);
                    return [4 /*yield*/, expect(builder.createUrlSet()).resolves.toStrictEqual([
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/about',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            // /about
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/nl-NL',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/fr/about',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            // page-0
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-0',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/fr/page-0',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                            // page-1
                            {
                                changefreq: 'daily',
                                lastmod: expect.any(String),
                                priority: 0.7,
                                loc: 'https://example.com/page-1',
                                alternateRefs: [],
                                trailingSlash: false
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
