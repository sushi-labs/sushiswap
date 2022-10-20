import type { ISitemapField, IAlternateRef } from '../interface.js';
/**
 * Builder class to generate xml and robots.txt
 * Returns only string values
 */
export declare class SitemapBuilder {
    /**
     * Create XML Template
     * @param content
     * @returns
     */
    withXMLTemplate(content: string): string;
    /**
     * Generates sitemap-index.xml
     * @param allSitemaps
     * @returns
     */
    buildSitemapIndexXml(allSitemaps: string[]): string;
    /**
     * Normalize sitemap field keys to stay consistent with <xsd:sequence> order
     * @link https://www.w3schools.com/xml/el_sequence.asp
     * @link https://github.com/iamvishnusankar/next-sitemap/issues/345
     * @param x
     * @returns
     */
    normalizeSitemapField(x: ISitemapField): {
        alternateRefs?: IAlternateRef[] | undefined;
        trailingSlash?: boolean | undefined;
        loc: string;
        lastmod: string | undefined;
        changefreq: ("always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never") | undefined;
        priority: number | undefined;
    };
    /**
     * Generates sitemap.xml
     * @param fields
     * @returns
     */
    buildSitemapXml(fields: ISitemapField[]): string;
    /**
     * Generate alternate refs.xml
     * @param alternateRefs
     * @returns
     */
    buildAlternateRefsXml(alternateRefs?: Array<IAlternateRef>): string;
}
