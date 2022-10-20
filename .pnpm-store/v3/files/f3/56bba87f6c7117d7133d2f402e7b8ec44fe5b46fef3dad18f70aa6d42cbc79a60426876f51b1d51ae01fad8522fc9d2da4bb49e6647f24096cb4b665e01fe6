import { overwriteMerge } from './merge.js';
export const defaultSitemapTransformer = async (config, loc) => {
    return {
        loc,
        lastmod: config?.autoLastmod ? new Date().toISOString() : undefined,
        changefreq: config?.changefreq,
        priority: config?.priority,
        alternateRefs: config.alternateRefs ?? [],
        trailingSlash: config?.trailingSlash,
    };
};
export const defaultRobotsTxtTransformer = async (_, text) => text;
export const defaultConfig = {
    sourceDir: '.next',
    outDir: 'public',
    priority: 0.7,
    sitemapBaseFileName: 'sitemap',
    changefreq: 'daily',
    sitemapSize: 5000,
    autoLastmod: true,
    exclude: [],
    transform: defaultSitemapTransformer,
    generateIndexSitemap: true,
    robotsTxtOptions: {
        transformRobotsTxt: defaultRobotsTxtTransformer,
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        additionalSitemaps: [],
    },
};
export const withDefaultConfig = (config) => {
    return overwriteMerge(defaultConfig, config);
};
