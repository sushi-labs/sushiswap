import { Container } from '@sushiswap/ui'
import { WithGhostBody, addGhostBody } from 'lib/ghost/addGhostBody'
import { Article, getArticle } from 'lib/strapi/article'
import { getArticleSlugs } from 'lib/strapi/articleSlugs'
import { getMoreArticles } from 'lib/strapi/moreArticles'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import {
  ArticleAuthors,
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  ArticleSeo,
  Breadcrumb,
} from '../components'

export async function getStaticPaths() {
  const allArticleSlugs = await getArticleSlugs()
  return {
    paths: allArticleSlugs?.reduce<string[]>((acc, slug) => {
      acc.push(`/${slug}`)
      return acc
    }, []),
    fallback: true,
  }
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string }
}) {
  const [article, moreArticles] = await Promise.all([
    getArticle({ slug: params.slug }),
    getMoreArticles(params.slug),
  ])

  if (!article) {
    return {
      props: {},
      notFound: true,
      revalidate: 15,
    }
  }

  const articleWithBody = await addGhostBody(article, article.ghostSlug)

  return {
    props: {
      article: articleWithBody,
      latestArticles: moreArticles,
    } satisfies ArticlePage,
    revalidate: 60,
  }
}

interface ArticlePage {
  article: WithGhostBody<Article>
  latestArticles: Article[]
}

const ArticlePage: FC<ArticlePage> = ({ article, latestArticles }) => {
  const router = useRouter()
  if (!router.isFallback && !article) {
    return <ErrorPage statusCode={404} />
  }

  if (!article) return null

  return (
    <>
      <ArticleSeo article={article} />
      <Breadcrumb />
      <Container className="px-4 mx-auto my-16" maxWidth="2xl">
        <main>
          <article className="relative pt-10">
            <ArticleHeader article={article} />
            <ArticleAuthors article={article} />
            <div
              className="mt-12 prose !prose-invert prose-slate"
              dangerouslySetInnerHTML={{
                __html: article.body || '',
              }}
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
