import type { IConfig, ISitemapField, INextManifest } from '../interface.js';
export declare class UrlSetBuilder {
    config: IConfig;
    manifest: INextManifest;
    constructor(config: IConfig, manifest: INextManifest);
    /**
     * Returns absolute url by combining siteUrl and path w.r.t trailingSlash config
     * @param siteUrl
     * @param path
     * @param trailingSlash
     * @returns
     */
    absoluteUrl(siteUrl: string, path: string, trailingSlash?: boolean): string;
    /**
     * Normalize sitemap fields to include absolute urls
     * @param field
     */
    normalizeSitemapField(field: ISitemapField): ISitemapField;
    /**
     * Create a unique url set
     */
    createUrlSet(): Promise<ISitemapField[]>;
}
