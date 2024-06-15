import { GetServerSideProps } from 'next'
import { ISitemapField, getServerSideSitemapLegacy } from 'next-sitemap'

import { getAllArticlesBySlug } from '../../lib/api'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { articles } = await getAllArticlesBySlug()
  const slugs = articles?.data.map((article) => article.attributes?.slug)

  const fields = slugs?.map<ISitemapField>((slug) => ({
    loc: `https://www.sushi.com/academy/articles/${slug}`,
    changefreq: 'never',
  }))

  return getServerSideSitemapLegacy(ctx, fields || [])
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
