"use strict";
exports.__esModule = true;
var sitemap_builder_js_1 = require("../../sitemap-builder.js");
describe('SitemapBuilder', function () {
    test('snapshot test to exclude undefined values from final sitemap', function () {
        // Builder instance
        var builder = new sitemap_builder_js_1.SitemapBuilder();
        // Build content
        var content = builder.buildSitemapXml([
            {
                loc: 'https://example.com',
                lastmod: undefined
            },
            {
                loc: 'https://example.com',
                lastmod: 'some-value',
                alternateRefs: [
                    {
                        href: 'https://example.com/en',
                        hreflang: 'en'
                    },
                    {
                        href: 'https://example.com/fr',
                        hreflang: 'fr'
                    },
                ]
            },
        ]);
        // Expect the generated sitemap to match snapshot.
        expect(content).toMatchInlineSnapshot("\n      \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\n      <urlset xmlns=\\\"http://www.sitemaps.org/schemas/sitemap/0.9\\\" xmlns:news=\\\"http://www.google.com/schemas/sitemap-news/0.9\\\" xmlns:xhtml=\\\"http://www.w3.org/1999/xhtml\\\" xmlns:mobile=\\\"http://www.google.com/schemas/sitemap-mobile/1.0\\\" xmlns:image=\\\"http://www.google.com/schemas/sitemap-image/1.1\\\" xmlns:video=\\\"http://www.google.com/schemas/sitemap-video/1.1\\\">\n      <url><loc>https://example.com</loc></url>\n      <url><loc>https://example.com</loc><lastmod>some-value</lastmod><xhtml:link rel=\\\"alternate\\\" hreflang=\\\"en\\\" href=\\\"https://example.com/en\\\"/><xhtml:link rel=\\\"alternate\\\" hreflang=\\\"fr\\\" href=\\\"https://example.com/fr\\\"/></url>\n      </urlset>\"\n    ");
    });
});
