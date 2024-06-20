import { getArticleSlugs } from 'lib/strapi/articleSlugs'
import type { GetServerSideProps } from 'next'
import type { ISitemapField } from 'next-sitemap'
import { getServerSideSitemapLegacy } from 'next-sitemap'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const articleSlugs = await getArticleSlugs()

  const fields = articleSlugs.map<ISitemapField>((slug) => ({
    loc: `https://www.sushi.com/blog/${slug}`,
    changefreq: 'never',
  }))

  return getServerSideSitemapLegacy(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
