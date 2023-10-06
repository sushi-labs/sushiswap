import { GhostArticle } from 'lib/ghost'
import { ArticleJsonLd, NextSeo } from 'next-seo'
import { FC } from 'react'

import { getOptimizedMedia, isMediaVideo } from '../../lib/media'

interface ArticleSeo {
  article?: GhostArticle['attributes']
}

export const ArticleSeo: FC<ArticleSeo> = ({ article }) => {
  if (!article) return <></>

  const cover = getOptimizedMedia({
    metadata: article.cover?.data?.attributes?.provider_metadata,
  })
  const coverAlt = article.cover?.data?.attributes?.alternativeText

  const authors = article.authors.data.map(({ attributes }) => ({
    name: attributes.name,
    url: `https://twitter.com/${attributes.handle}`,
  }))

  return (
    <>
      <NextSeo
        title={article.title}
        description={article.description}
        openGraph={{
          ...(isMediaVideo(article.cover?.data?.attributes?.provider_metadata)
            ? {
                videos: [{ url: cover }],
              }
            : {
                images: [{ url: cover, alt: coverAlt }],
              }),
          article: {
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authors: authors.map((author) => author.name),
            tags: article.categories?.data.reduce<string[]>((acc, el) => [...acc, el.attributes.name], []),
          },
        }}
        twitter={{
          cardType: isMediaVideo(article.cover?.data?.attributes?.provider_metadata) ? 'player' : 'summary_large_image',
        }}
      />
      <ArticleJsonLd
        type="Article"
        url={`https://www.sushi.com/blog/${article.slug}`}
        title={article.title}
        description={article.description}
        authorName={authors}
        images={[cover]}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
      />
    </>
  )
}

export default ArticleSeo
