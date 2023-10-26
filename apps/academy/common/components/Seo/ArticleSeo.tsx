import { GhostArticle } from 'lib/ghost'
import { ArticleJsonLd, NextSeo } from 'next-seo'
import { FC } from 'react'

import { Maybe } from '../../../.mesh'
import { getOptimizedMedia, isMediaVideo } from '../../../lib/media'

interface ArticleSeo {
  article?: Maybe<GhostArticle['attributes']> | undefined
}

export const ArticleSeo: FC<ArticleSeo> = ({ article }) => {
  if (!article) return <></>

  const cover = getOptimizedMedia({
    metadata: article.cover?.data?.attributes?.provider_metadata,
  })
  const coverAlt = article.cover?.data?.attributes?.alternativeText

  const authors = article?.authors?.data.map(({ attributes }) => ({
    name: attributes?.name as string,
    url: `https://twitter.com/${attributes?.handle}`,
  }))

  return (
    <>
      <NextSeo
        title={article.title}
        description={article.description}
        openGraph={{
          ...(isMediaVideo(article.cover.data?.attributes?.provider_metadata)
            ? {
                videos: [{ url: cover }],
              }
            : {
                images: [{ url: cover, alt: coverAlt || '' }],
              }),
          article: {
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authors: authors?.map((author) => author.name),
            tags: article.topics?.data.flat().filter(Boolean) as string[],
          },
        }}
        twitter={{
          cardType: isMediaVideo(
            article.cover?.data?.attributes?.provider_metadata,
          )
            ? 'player'
            : 'summary_large_image',
        }}
      />
      <ArticleJsonLd
        type="Article"
        url={`https://www.sushi.com/academy/articles/${article.slug}`}
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
