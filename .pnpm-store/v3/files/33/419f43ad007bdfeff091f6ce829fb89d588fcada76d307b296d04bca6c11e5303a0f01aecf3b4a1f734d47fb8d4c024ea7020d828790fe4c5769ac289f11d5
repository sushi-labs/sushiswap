import { withXMLResponse } from './response.js';
import { SitemapBuilder } from '../builders/sitemap-builder.js';
/**
 * Generate server side sitemaps
 * @param ctx
 * @param fields
 * @returns
 */
export const getServerSideSitemap = async (ctx, fields) => {
    // Generate sitemap xml
    const contents = new SitemapBuilder().buildSitemapXml(fields);
    return withXMLResponse(ctx, contents);
};
