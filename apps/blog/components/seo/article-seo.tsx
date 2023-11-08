import { ArticleJsonLd, NextSeo } from 'next-seo'
import type { FC } from 'react'
import type { GhostArticle } from '../../lib/ghost'
import { getOptimizedMedia, isMediaVideo } from '../../lib/media'

interface ArticleSeoProps {
  article?: GhostArticle['attributes']
}

export const ArticleSeo: FC<ArticleSeoProps> = ({ article }) => {
  if (!article) return <></>

  const cover = getOptimizedMedia({
    metadata: article.cover.data.attributes.provider_metadata,
  })
  const coverAlt = article.cover.data.attributes.alternativeText

  const authors = article.authors.data.map(({ attributes }) => ({
    name: attributes.name,
    url: `https://twitter.com/${attributes.handle}`,
  }))

  return (
    <>
      <NextSeo
        description={article.description}
        openGraph={{
          ...(isMediaVideo(article.cover.data.attributes.provider_metadata)
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
            tags: article.categories.data.reduce<string[]>((acc, el) => {
              acc.push(el.attributes.name)
              return acc
            }, []),
          },
        }}
        title={article.title}
        twitter={{
          cardType: isMediaVideo(
            article.cover.data.attributes.provider_metadata,
          )
            ? 'player'
            : 'summary_large_image',
        }}
      />
      <ArticleJsonLd
        authorName={authors}
        dateModified={article.updatedAt}
        datePublished={article.publishedAt}
        description={article.description}
        images={[cover]}
        title={article.title}
        type="Article"
        url={`https://www.sushi.com/blog/${article.slug}`}
      />
    </>
  )
}

export default ArticleSeo
