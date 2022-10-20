"use strict";
exports.__esModule = true;
var config_js_1 = require("../../../__fixtures__/config.js");
var robots_txt_builder_js_1 = require("../../robots-txt-builder.js");
var builder;
beforeEach(function () {
    builder = new robots_txt_builder_js_1.RobotsTxtBuilder();
});
describe('RobotsTxtBuilder', function () {
    test('generateRobotsTxt: additionalSitemap', function () {
        expect(builder.generateRobotsTxt(config_js_1.sampleConfig))
            .toMatchInlineSnapshot("\n      \"# *\n      User-agent: *\n      Allow: /\n\n      # black-listed-bot\n      User-agent: black-listed-bot\n      Disallow: /sub-path-1\n      Disallow: /path-2\n\n      # friendly-bot\n      User-agent: friendly-bot\n      Allow: /\n      Crawl-delay: 10\n\n      # Host\n      Host: https://example.com\n\n      # Sitemaps\n      Sitemap: https://example.com/my-custom-sitemap-1.xml\n      Sitemap: https://example.com/my-custom-sitemap-2.xml\n      Sitemap: https://example.com/my-custom-sitemap-3.xml\n      \"\n    ");
    });
});
