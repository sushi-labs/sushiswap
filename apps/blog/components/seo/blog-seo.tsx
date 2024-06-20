import { Article } from 'lib/strapi/article'
import { ArticleJsonLd } from 'next-seo'
import type { FC } from 'react'
import useSWR from 'swr'
import SEO from '../../next-seo.config'

export const BlogSeo: FC = () => {
  const { data: articles } = useSWR<Article[]>('/articles')

  return (
    <ArticleJsonLd
      authorName="Sushi"
      dateModified={articles?.[0].updatedAt}
      datePublished={articles?.[0].publishedAt || ''}
      description={SEO.description}
      images={SEO.openGraph.images.map((image) => image.url)}
      title={SEO.title}
      type="Blog"
      url={SEO.openGraph.url}
    />
  )
}

export default BlogSeo
