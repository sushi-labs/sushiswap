import { getAcademyArticles } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Article, WithContext } from 'schema-dts'
import { DEFAULT_SIDE_PADDING } from '../../constants'
import { getGhostBody } from '../../lib/ghost/ghost'
import { getOptimizedMedia, isMediaVideo } from '../../lib/media'
import { ArticleList } from '../components/article-list/article-list'
import { ViewMoreButton } from '../components/view-more-button'
import { ArticleHeader } from './components/article-header'
import { ArticleLinks } from './components/article-links'
import { Breadcrumb } from './components/breadcrumb'

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
  } = await getAcademyArticles({
    filters: { slug: { eq: params['article-slug'] } },
  })

  if (!article) return {}

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
      tags: [...article.topics, ...article.products]
        .flat()
        .reduce<string[]>((acc, el) => {
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
  let body: string

  try {
    const articleP = getAcademyArticles({
      filters: { slug: { eq: params['article-slug'] } },
      pagination: { limit: 1 },
    })

    const moreArticlesP = getAcademyArticles({
      filters: { slug: { ne: params['article-slug'] } },
      pagination: { limit: 3 },
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
        maxWidth="6xl"
        className={classNames(
          'mx-auto space-y-4 sm:pb-36 pb-20',
          DEFAULT_SIDE_PADDING,
        )}
      >
        <Breadcrumb article={article} />
        <ArticleHeader article={article} />

        <div className="sm:grid grid-cols-[min-content,1fr] justify-items-center gap-16 sm:pt-[50px]">
          <aside className="flex-col hidden w-full gap-8 min-w-[180px] max-w-[280px] sm:flex sticky h-fit top-28">
            <ArticleLinks article={article} />
            <hr className="border border-slate-200/5" />
          </aside>
          <article className="!prose-invert prose prose-slate">
            <div
              dangerouslySetInnerHTML={{
                __html: body || '',
              }}
            />
          </article>
        </div>

        <div className="space-y-8 flex justify-center items-center flex-col w-full">
          <div className="space-y-10 w-full">
            <span className="text-xl font-bold sm:text-2xl">
              Similar Articles
            </span>
            <ArticleList
              articles={moreArticles}
              className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] w-full"
            />
          </div>
          <ViewMoreButton />
        </div>
      </Container>
    </section>
  )
}
