// @ts-check
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.sushi.com/academy',
  changefreq: 'daily',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.sushi.com/academy/article-sitemap.xml'],
  },
  transform: (config, path) => {
    // Ignore articles, they'll be added dynamically
    // ! Array has to be updated if pages are added
    if (!['/', '/articles'].includes(path)) {
      return
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}

export default config
