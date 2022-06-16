import { Container } from '@sushiswap/ui'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { ArticleEntity, CmsTypes, ComponentSharedMedia, ComponentSharedRichText } from '../.graphclient'
import {
  ArticleAuthors,
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  Breadcrumb,
  MediaBlock,
  PreviewBanner,
  RichTextBlock,
  Seo,
  SeoType,
} from '../components'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../lib/api'
import GlobalEntity = CmsTypes.GlobalEntity

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug) acc.push(`/${article?.attributes.slug}`)

      console.log(acc)
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
  const data = await getArticleAndMoreArticles(params.slug, preview)

  return {
    props: {
      article: data?.articles?.data?.[0],
      latestArticles: data?.moreArticles?.data,
      preview: !!preview,
    },
    revalidate: 1,
  }
}

interface ArticlePage {
  global: GlobalEntity
  article?: ArticleEntity
  latestArticles?: ArticleEntity[]
  preview: boolean
}

const ArticlePage: FC<ArticlePage> = ({ global, article, latestArticles, preview }) => {
  const router = useRouter()
  if (!router.isFallback && !article?.attributes?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const seo: SeoType =
    article?.attributes && article?.id
      ? {
          id: article.id,
          slug: article?.attributes.slug,
          metaTitle: article?.attributes.title,
          metaDescription: article?.attributes.description,
          shareImage: article?.attributes.cover,
          article: true,
          tags: article?.attributes.categories?.data.reduce<string[]>((acc, el) => {
            if (el?.attributes?.name) acc.push(el?.attributes.name)
            return acc
          }, []),
        }
      : undefined

  return (
    <>
      <Seo global={global} seo={seo} />
      <PreviewBanner show={preview} />
      <Breadcrumb />
      <Container maxWidth="2xl" className="mx-auto px-4 my-16">
        <main>
          <article className="relative pt-10">
            <ArticleHeader article={article} />
            <ArticleAuthors article={article} />
            <div className="mt-12 prose !prose-invert prose-slate">
              {article?.attributes?.blocks?.map((block, i) => {
                // @ts-ignore
                if (block?.__typename === 'ComponentSharedRichText') {
                  return <RichTextBlock block={block as ComponentSharedRichText} key={i} />
                }

                // @ts-ignore
                if (block?.__typename === 'ComponentSharedMedia') {
                  return <MediaBlock block={block as ComponentSharedMedia} key={i} />
                }

                // @ts-ignore
                if (block?.__typename === 'ComponentSharedDivider') {
                  return <hr key={i} className="border border-slate-200/5 my-12" />
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
