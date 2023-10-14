import { ArticleJsonLd } from 'next-seo'
import type { FC } from 'react'
import useSWR from 'swr'
import type { ArticleEntityResponseCollection } from '../../.mesh'
import SEO from '../../next-seo.config'

export const BlogSeo: FC = () => {
  const { data: articlesData } =
    useSWR<ArticleEntityResponseCollection>('/articles')

  return (
    <ArticleJsonLd
      authorName="Sushi"
      dateModified={articlesData?.data[0].attributes?.updatedAt}
      datePublished={articlesData?.data[0].attributes?.publishedAt}
      description={SEO.description}
      images={SEO.openGraph.images}
      title={SEO.title}
      type="Blog"
      url={SEO.openGraph.url}
    />
  )
}

export default BlogSeo
