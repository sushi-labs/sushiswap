import { Article } from 'lib/strapi/article'
import { ArticleJsonLd, NextSeo } from 'next-seo'
import type { FC } from 'react'
import { getOptimizedMedia, isMediaVideo } from '../../lib/media'

interface ArticleSeoProps {
  article?: Article
}

export const ArticleSeo: FC<ArticleSeoProps> = ({ article }) => {
  if (!article) return <></>

  const cover = getOptimizedMedia({
    metadata: article.cover.provider_metadata,
  })
  const coverAlt = article.cover.alternativeText

  const authors = article.authors.map(({ name, handle }) => ({
    name: name,
    url: `https://twitter.com/${handle}`,
  }))

  return (
    <>
      <NextSeo
        description={article.description}
        openGraph={{
          ...(isMediaVideo(article.cover.provider_metadata)
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
            tags: article.categories.reduce<string[]>((acc, el) => {
              acc.push(el.name)
              return acc
            }, []),
          },
        }}
        title={article.title}
        twitter={{
          cardType: isMediaVideo(article.cover.provider_metadata)
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
