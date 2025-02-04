import { ChevronLeftIcon } from '@heroicons/react-v1/solid'
import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { Container, LinkInternal } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Article, WithContext } from 'schema-dts'
import { getGhostBody } from '../../lib/ghost/ghost'
import { getOptimizedMedia, isMediaVideo } from '../../lib/media'
import { ArticleAuthors } from '../components/article-authors'
import { ArticleHeader } from '../components/article-header'
import { ArticleFooter } from './components/article-footer'
import { ArticleLinks } from './components/article-links/article-links'

interface Props {
  params: Promise<{
    'article-slug': string
  }>
}

export const revalidate = 3600

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {
    articles: [article],
  } = await getBlogArticles({
    filters: { slug: { eq: params['article-slug'] } },
  })

  if (!article) {
    return {}
  }

  const cover = getOptimizedMedia({
    metadata: article.cover.provider_metadata,
  })

  const media = isMediaVideo(article.cover.provider_metadata)
    ? {
        videos: [{ url: cover }],
      }
    : {
        images: [{ url: cover, alt: article.cover.alternativeText }],
      }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      ...media,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.authors.map((author) => author.name),
      tags: article.categories.reduce<string[]>((acc, el) => {
        acc.push(el.name)
        return acc
      }, []),
    },
    twitter: {
      card: isMediaVideo(article.cover.provider_metadata)
        ? 'player'
        : 'summary_large_image',
      creator: '@SushiSwap',
    },
  }
}

export default async function Page(props: Props) {
  const params = await props.params
  let article
  let moreArticles
  let body

  try {
    const articleP = getBlogArticles({
      filters: { slug: { eq: params['article-slug'] } },
      pagination: { limit: 1 },
    })

    const moreArticlesP = getBlogArticles({
      filters: { slug: { ne: params['article-slug'] } },
      pagination: { limit: 2 },
    })

    article = (await articleP).articles[0]
    body = await getGhostBody(article.ghostSlug).then(({ html }) => html)
    moreArticles = (await moreArticlesP).articles
  } catch {
    return notFound()
  }

  const jsonLd: WithContext<Article> = {
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
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
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
    url: `https://www.sushi.com/blog/${article.slug}`,
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container
        maxWidth="2xl"
        className="px-5 md:px-8 space-y-12 pb-14 pt-4 justify-center"
      >
        <LinkInternal className="flex items-center gap-2 group" href="/blog">
          <ChevronLeftIcon
            className="text-slate-400 group-hover:text-slate-50"
            width={24}
          />
          <span className="text-sm font-medium cursor-pointer group-hover:text-slate-50 text-slate-400">
            Go Back
          </span>
        </LinkInternal>
        <div>
          <ArticleHeader article={article} />
          <ArticleAuthors article={article} />
        </div>
        <div
          className="prose dark:!prose-invert prose-slate !min-w-full"
          dangerouslySetInnerHTML={{
            __html: body || '',
          }}
        />
        <div>
          <ArticleLinks article={article} />
          <ArticleFooter articles={moreArticles} />
        </div>
      </Container>
    </section>
  )
}
