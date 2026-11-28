import type {
  AcademyArticle,
  BlogArticle,
} from '@sushiswap/graph-client/strapi'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import type { Article, WithContext } from 'schema-dts'
import { getGhostBody } from './ghost/ghost'
import { getOptimizedMedia, isMediaVideo } from './media'

async function getCachedGhostBody(slug: string) {
  'use cache'
  cacheLife({ revalidate: 3600 })
  return getGhostBody(slug)
}

type CmsArticle = AcademyArticle | BlogArticle

export async function loadArticlePage<T extends CmsArticle>(
  articleResult: Promise<{ articles: T[] }>,
  relatedResult: Promise<{ articles: T[] }>,
): Promise<{ article: T; body: string; moreArticles: T[] } | null> {
  const articleWithBody = articleResult.then(
    async ({ articles: [article] }) => {
      if (!article?.ghostSlug) return null

      const { html: body } = await getCachedGhostBody(article.ghostSlug)
      return { article, body }
    },
  )

  try {
    const [page, { articles: moreArticles }] = await Promise.all([
      articleWithBody,
      relatedResult,
    ])
    return page ? { ...page, moreArticles } : null
  } catch {
    return null
  }
}

export function getArticleMetadata(article: CmsArticle): Metadata {
  const { cover } = article
  const url = getOptimizedMedia({ metadata: cover.provider_metadata })
  const isVideo = isMediaVideo(cover.provider_metadata)
  const tags =
    'categories' in article
      ? article.categories
      : [...article.topics, ...article.products]

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      ...(isVideo
        ? { videos: [{ url }] }
        : { images: [{ url, alt: cover.alternativeText }] }),
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? undefined,
      authors: article.authors.map(({ name }) => name),
      tags: tags
        .map(({ name }) => name)
        .filter((name): name is string => !!name),
    },
    twitter: {
      card: isVideo ? 'player' : 'summary_large_image',
      creator: '@SushiSwap',
    },
  }
}

export function getArticleJsonLd(
  article: CmsArticle,
  url: string,
): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: article.authors.map(({ name, email, handle }) => ({
      '@type': 'Person',
      name,
      email,
      url: `https://twitter.com/${handle}`,
    })),
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? undefined,
    image: {
      '@type': 'ImageObject',
      url: article.cover.url,
      width: {
        '@type': 'QuantitativeValue',
        value: article.cover.width,
      },
      height: {
        '@type': 'QuantitativeValue',
        value: article.cover.height,
      },
      alternateName: article.cover.alternativeText,
      caption: article.cover.caption,
    },
    url,
  }
}
