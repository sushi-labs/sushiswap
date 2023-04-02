import { Container } from '@sushiswap/ui'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Article, MediaBlock as MediaBlockType, RichTextBlock as RichTextBlockType } from 'types'

import {
  ArticleAuthors,
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  ArticleSeo,
  Breadcrumb,
  MediaBlock,
  PreviewBanner,
  RichTextBlock,
} from '../components'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../lib/api'

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug) acc.push(`/${article?.attributes.slug}`)

      // console.log(acc)
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

  if (!data?.articles?.data?.[0]) {
    return {
      props: {},
      notFound: true,
    }
  }

  return {
    props: {
      article: data.articles.data[0],
      latestArticles: data?.moreArticles?.data,
      preview: !!preview,
    },
    revalidate: 60,
  }
}

interface ArticlePage {
  article?: Article
  latestArticles?: Article[]
  preview: boolean
}

const ArticlePage: FC<ArticlePage> = ({ article, latestArticles, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !article?.attributes?.slug) {
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
            <div className="mt-12 prose !prose-invert prose-slate">
              {article?.attributes?.blocks?.map((block, i) => {
                // @ts-ignore
                if (block?.__typename === 'ComponentSharedRichText') {
                  return <RichTextBlock block={block as RichTextBlockType} key={i} />
                }

                // @ts-ignore
                if (block?.__typename === 'ComponentSharedMedia') {
                  return <MediaBlock block={block as MediaBlockType} key={i} />
                }

                // @ts-ignore
                if (block?.__typename === 'ComponentSharedDivider') {
                  return <hr key={i} className="my-12 border border-slate-200/5" />
                }
              })}
            </div>
            <ArticleLinks article={article} />
            <ArticleFooter articles={latestArticles} />
          </article>
        </main>
      </Container>
    </>
  )
}

export default ArticlePage
