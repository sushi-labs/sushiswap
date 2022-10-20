"use strict";
exports.__esModule = true;
var url_js_1 = require("../url.js");
describe('next-sitemap/url', function () {
    test('isURL : Valid', function () {
        expect((0, url_js_1.isURL)('https://example.com')).toBeTruthy();
    });
    test('isURL : Invalid', function () {
        expect((0, url_js_1.isURL)('/someone-relative/path/item.jpg')).toBeFalsy();
    });
    test('cleanPath : Relative Path', function () {
        expect((0, url_js_1.cleanPath)('./epic///awesome///path')).toBe('./epic/awesome/path');
    });
    test('cleanPath: Public Url', function () {
        expect((0, url_js_1.cleanPath)('https://www.example.com//epic///awesome///path')).toBe('https://www.example.com/epic/awesome/path');
    });
    test('generateUrl: with relative slug', function () {
        var url = (0, url_js_1.generateUrl)('https://base.example.com', '//awesome/path');
        expect(url).toBe('https://base.example.com/awesome/path');
    });
    test('generateUrl: with external slug', function () {
        var url = (0, url_js_1.generateUrl)('https://base.example.com', 'https://cdn.another.site/new//path');
        expect(url).toBe('https://cdn.another.site/new/path');
    });
    test('isNextInternalUrl', function () {
        expect((0, url_js_1.isNextInternalUrl)('/_app')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/404')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/500')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/_random')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/_middleware')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/about/_middleware')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/some_url/about/_middleware')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/projects/[id]/_middleware')).toBeTruthy();
    });
    test('isNextInternalUrl: url params', function () {
        expect((0, url_js_1.isNextInternalUrl)('/[id]')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/blog/[id]')).toBeTruthy();
    });
    test('isNextInternalUrl: allow urls with underscore`', function () {
        expect((0, url_js_1.isNextInternalUrl)('/_some_url')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/some_url/[param]')).toBeTruthy();
        expect((0, url_js_1.isNextInternalUrl)('/some_url')).toBeFalsy();
        expect((0, url_js_1.isNextInternalUrl)('/some-404')).toBeFalsy();
        expect((0, url_js_1.isNextInternalUrl)('/some-500')).toBeFalsy();
    });
    test('createDefaultLocaleReplace: replaces default locale within path`', function () {
        var replaceDefaultLocale = (0, url_js_1.createDefaultLocaleReplace)('en-US');
        expect(replaceDefaultLocale('/')).toBe('/');
        expect(replaceDefaultLocale('/en-US')).toBe('/');
        expect(replaceDefaultLocale('/en-US/')).toBe('/');
        expect(replaceDefaultLocale('/en-US/home')).toBe('/home');
        expect(replaceDefaultLocale('/en-US/home/')).toBe('/home/');
        expect(replaceDefaultLocale('/en-US-home')).toBe('/en-US-home');
        expect(replaceDefaultLocale('/en-USA/home')).toBe('/en-USA/home');
        expect(replaceDefaultLocale('/fr')).toBe('/fr');
        expect(replaceDefaultLocale('/fr/about')).toBe('/fr/about');
    });
});
