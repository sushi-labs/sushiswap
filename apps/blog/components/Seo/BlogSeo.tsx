import { ArticleJsonLd } from 'next-seo'
import { FC } from 'react'
import useSWR from 'swr'

import SEO from '../../next-seo.config'
import { ArticleEntityResponseCollection } from '.mesh'

export const BlogSeo: FC = () => {
  const { data: articlesData } =
    useSWR<ArticleEntityResponseCollection>('/articles')

  return (
    <ArticleJsonLd
      type="Blog"
      url={SEO.openGraph.url}
      title={SEO.title}
      description={SEO.description}
      authorName="Sushi"
      images={SEO.openGraph.images}
      datePublished={articlesData?.data[0].attributes?.publishedAt}
      dateModified={articlesData?.data[0].attributes?.updatedAt}
    />
  )
}

export default BlogSeo
