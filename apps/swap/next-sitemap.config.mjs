// @ts-check
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: `https://sushi.com/swap`,
  changefreq: 'daily',
  generateRobotsTxt: true,
  transform: (config, path) => {
    // Use default transformation for all other cases
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
