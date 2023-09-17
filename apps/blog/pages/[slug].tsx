import { Container } from '@sushiswap/ui/components/container'
import { addBodyToArticle, GhostArticle } from 'lib/ghost'
import { ArticleSchema } from 'lib/validate'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Article } from 'types'

import {
  ArticleAuthors,
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  ArticleSeo,
  Breadcrumb,
  PreviewBanner,
} from '../components'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../lib/api'

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug) acc.push(`/${article?.attributes.slug}`)
      return acc
    }, []),
    fallback: true,
  }
}

export async function getStaticProps({
  params,
  preview = null,
}: {
  params: { slug: string }
  preview: Record<string, unknown> | null
}) {
  const data = await getArticleAndMoreArticles(params.slug, !!preview)
  const article = data?.articles?.data?.[0]

  if (!article) {
    return {
      props: {},
      notFound: true,
    }
  }

  const parsedArticle = ArticleSchema.safeParse(article)

  if (!parsedArticle.success) {
    return {
      props: {},
      notFound: false,
    }
  }

  return {
    props: {
      article: await addBodyToArticle(parsedArticle.data),
      latestArticles: data?.moreArticles?.data,
      preview: !!preview,
    },
    revalidate: 60,
  }
}

interface ArticlePage {
  article?: GhostArticle
  latestArticles?: Article[]
  preview: boolean
}

const ArticlePage: FC<ArticlePage> = ({ article, latestArticles, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !article) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <ArticleSeo article={article?.attributes} />
      <PreviewBanner show={preview} />
      <Breadcrumb />
      <Container maxWidth="2xl" className="px-4 mx-auto my-16">
        <main>
          <article className="relative pt-10">
            <ArticleHeader article={article} />
            <ArticleAuthors article={article} />
            <div
              className="mt-12 prose !prose-invert prose-slate"
              dangerouslySetInnerHTML={{ __html: article?.attributes.body || '' }}
            />
            <ArticleLinks article={article} />
            <ArticleFooter articles={latestArticles} />
          </article>
        </main>
      </Container>
    </>
  )
}

export default ArticlePage
