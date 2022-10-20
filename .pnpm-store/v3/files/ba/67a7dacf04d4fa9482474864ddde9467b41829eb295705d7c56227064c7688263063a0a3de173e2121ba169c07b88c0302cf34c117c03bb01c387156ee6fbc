export declare const cleanPath: (text: string) => string;
export declare const isURL: (text: string) => boolean;
export declare const generateUrl: (baseUrl: string, slug: string) => string;
/**
 * Checks whether a url is next.js specific or not
 * @param path path check
 */
export declare const isNextInternalUrl: (path: string) => boolean;
/**
 * Creates a replace function to replace the default locale
 * Avoids creating the same RegExp within each replace
 *
 * Replaces only if the path does not contain the locale as an actual valid path
 *
 * Given a default locale of en-US it replaces:
 * /en-US -> /
 * /en-US/home -> /home
 * /en-US/home/ -> /home/
 *
 * Does not replace if its actual page
 * /en-USA -> /en-USA
 * /en-USA/home -> /en-USA/home
 * /en-US-home -> /en-US-home
 *
 * @param defaultLocale defaultLocale as provided by i18n within next config
 */
export declare const createDefaultLocaleReplace: (defaultLocale: string) => any;
/**
 * Return UTF-8 encoded urls
 * @param path
 * @returns
 * @link https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#general-guidelines
 */
export declare const entityEscapedUrl: (path: string) => string;
