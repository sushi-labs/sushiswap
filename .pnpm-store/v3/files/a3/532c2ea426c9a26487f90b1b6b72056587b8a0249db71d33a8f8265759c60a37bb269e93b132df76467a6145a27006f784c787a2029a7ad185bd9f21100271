import { SitemapBuilder } from '../builders/sitemap-builder.js';
import { withXMLResponse } from './response.js';
/**
 * Generate index sitemaps on server side
 * @param ctx
 * @param sitemaps
 * @returns
 */
export const getServerSideSitemapIndex = async (ctx, sitemaps) => {
    // Generate index sitemap xml content
    const indexContents = new SitemapBuilder().buildSitemapIndexXml(sitemaps);
    // Return response
    return withXMLResponse(ctx, indexContents);
};
