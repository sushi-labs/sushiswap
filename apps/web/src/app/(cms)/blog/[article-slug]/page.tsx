import { ChevronLeftIcon } from '@heroicons/react-v1/solid'
import { getBlogArticles } from '@sushiswap/graph-client/strapi'
import { Container, LinkInternal } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  getArticleJsonLd,
  getArticleMetadata,
  loadArticlePage,
} from '../../lib/articles'
import { ArticleAuthors } from '../components/article-authors'
import { ArticleHeader } from '../components/article-header'
import { ArticleFooter } from './components/article-footer'
import { ArticleLinks } from './components/article-links/article-links'

interface Props {
  params: Promise<{
    'article-slug': string
  }>
}

async function getCachedBlogArticles(
  input: Parameters<typeof getBlogArticles>[0],
) {
  'use cache'
  cacheLife({ revalidate: 3600 })

  return getBlogArticles(input)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {
    articles: [article],
  } = await getCachedBlogArticles({
    filters: { slug: { eq: params['article-slug'] } },
  })

  return article ? getArticleMetadata(article) : {}
}

export default async function Page(props: Props) {
  const slug = (await props.params)['article-slug']
  const page = await loadArticlePage(
    getCachedBlogArticles({
      filters: { slug: { eq: slug } },
      pagination: { limit: 1 },
    }),
    getCachedBlogArticles({
      filters: { slug: { ne: slug } },
      pagination: { limit: 2 },
    }),
  )

  if (!page) return notFound()

  const { article, body, moreArticles } = page
  const jsonLd = getArticleJsonLd(
    article,
    `https://www.sushi.com/blog/${article.slug}`,
  )

  return (
    <section className="animate-slide">
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
            __html: body,
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
