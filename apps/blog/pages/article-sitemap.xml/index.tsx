import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

import { getAllArticlesBySlug } from '../../lib/api'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { articles } = await getAllArticlesBySlug()

  const slugs = (articles?.data || []).map((article) => article.attributes?.slug)

  const fields = slugs.map<ISitemapField>((slug) => ({
    loc: `https://www.sushi.com/blog/${slug}`,
    changefreq: 'never',
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
