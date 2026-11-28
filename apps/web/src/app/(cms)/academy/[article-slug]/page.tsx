import { getAcademyArticles } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { DEFAULT_SIDE_PADDING } from '../../constants'
import {
  getArticleJsonLd,
  getArticleMetadata,
  loadArticlePage,
} from '../../lib/articles'
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

async function getCachedAcademyArticles(
  input: Parameters<typeof getAcademyArticles>[0],
) {
  'use cache'
  cacheLife({ revalidate: 3600 })

  return getAcademyArticles(input)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {
    articles: [article],
  } = await getCachedAcademyArticles({
    filters: { slug: { eq: params['article-slug'] } },
  })

  return article ? getArticleMetadata(article) : {}
}

export default async function Page(props: Props) {
  const slug = (await props.params)['article-slug']
  const page = await loadArticlePage(
    getCachedAcademyArticles({
      filters: { slug: { eq: slug } },
      pagination: { limit: 1 },
    }),
    getCachedAcademyArticles({
      filters: { slug: { ne: slug } },
      pagination: { limit: 3 },
    }),
  )

  if (!page) return notFound()

  const { article, body, moreArticles } = page
  const jsonLd = getArticleJsonLd(
    article,
    `https://www.sushi.com/academy/${article.slug}`,
  )

  return (
    <section className="animate-slide">
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
                __html: body,
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
