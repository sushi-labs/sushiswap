"use strict";
exports.__esModule = true;
var config_js_1 = require("../../../__fixtures__/config.js");
var manifest_js_1 = require("../../../__fixtures__/manifest.js");
var url_set_builder_js_1 = require("../../url-set-builder.js");
var urlSetBuilder;
beforeEach(function () {
    urlSetBuilder = new url_set_builder_js_1.UrlSetBuilder(config_js_1.sampleConfig, manifest_js_1.sampleManifest);
});
describe('UrlSetBuilder', function () {
    test('absoluteUrl: Without trailing slash', function () {
        expect(urlSetBuilder.absoluteUrl('https://example.com', '/', false)).toBe('https://example.com');
        expect(urlSetBuilder.absoluteUrl('https://example.com/hello/', '/', false)).toBe('https://example.com/hello');
    });
    test('absoluteUrl: With trailing slash', function () {
        expect(urlSetBuilder.absoluteUrl('https://example.com', '/', true)).toBe('https://example.com/');
        expect(urlSetBuilder.absoluteUrl('https://example.com/hello/', '/', true)).toBe('https://example.com/hello/');
    });
    test('absoluteUrl: With uri encoding', function () {
        expect(urlSetBuilder.absoluteUrl("https://example.com/&/'/\"/>/<", '/', true)).toMatchInlineSnapshot("\"https://example.com/&amp;/&apos;/&quot;/&gt;/&lt;/\"");
    });
});
