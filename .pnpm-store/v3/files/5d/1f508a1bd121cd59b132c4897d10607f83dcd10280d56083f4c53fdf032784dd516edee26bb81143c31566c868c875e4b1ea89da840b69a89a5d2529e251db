import type { IConfig, IExportable, IRuntimePaths, ISitemapField } from '../interface.js';
import { SitemapBuilder } from './sitemap-builder.js';
import { RobotsTxtBuilder } from './robots-txt-builder.js';
export declare class ExportableBuilder {
    exportableList: IExportable[];
    config: IConfig;
    runtimePaths: IRuntimePaths;
    sitemapBuilder: SitemapBuilder;
    robotsTxtBuilder: RobotsTxtBuilder;
    exportDir: string;
    constructor(config: IConfig, runtimePaths: IRuntimePaths);
    /**
     * Register sitemap index files
     */
    registerIndexSitemap(): Promise<void>;
    /**
     * Resolve filename if index sitemap is generated
     * @param index
     * @returns
     */
    resolveFilenameWithIndexSitemap(index: number): string;
    /**
     * Resolve filename if index sitemaps is not generated
     * @param index
     * @returns
     */
    resolveFilenameWithoutIndexSitemap(index: number): string;
    /**
     * Register sitemaps with exportable builder
     * @param chunks
     */
    registerSitemaps(chunks: ISitemapField[][]): Promise<void>;
    /**
     * Get robots.txt export config
     * @returns
     */
    robotsTxtExportConfig(): {
        siteUrl: string;
        changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
        priority: any;
        sitemapBaseFileName: string;
        sourceDir: string;
        outDir: string;
        sitemapSize: number;
        generateRobotsTxt: boolean;
        robotsTxtOptions: import("../interface.js").IRobotsTxt;
        autoLastmod: boolean;
        exclude: string[];
        alternateRefs: import("../interface.js").IAlternateRef[];
        transform: (config: IConfig, url: string) => (ISitemapField | undefined) | Promise<ISitemapField | undefined>;
        additionalPaths: (config: Readonly<IConfig & {
            transform: (config: IConfig, url: string) => (ISitemapField | undefined) | Promise<ISitemapField | undefined>;
        }>) => (ISitemapField | undefined)[] | Promise<(ISitemapField | undefined)[]>;
        trailingSlash: boolean;
        generateIndexSitemap: boolean;
    };
    /**
     * Register robots.txt export
     */
    registerRobotsTxt(): Promise<void>;
    /**
     * Generic reducer to extract by type
     * @param condition
     * @returns
     */
    exportableUrlReducer(condition: (curr: IExportable) => boolean): string[];
    /**
     * Return a lit of sitemap urls
     * @returns
     */
    generatedSitemaps(): string[];
    generatedSitemapIndices(): string[];
}
