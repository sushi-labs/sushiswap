import { useBreakpoint } from '@sushiswap/hooks'
import { classNames, Container, LoadingOverlay } from '@sushiswap/ui'
import { APP_HEADER_HEIGHT, DEFAULT_SIDE_PADDING } from 'common/helpers'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'

import {
  ArticleBlocksDynamicZone,
  ArticleEntity,
  ComponentSharedMedia,
  ComponentSharedRichText,
  Maybe,
} from '../../.mesh'
import {
  ArticleFooter,
  ArticleHeader,
  ArticleHeaderSelector,
  ArticleLinks,
  ArticleSeo,
  Breadcrumb,
  MediaBlock,
  PreviewBanner,
  RichTextBlock,
} from '../../common/components'
import { Image } from '../../common/components'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../../lib/api'

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug) acc.push(`/articles/${article?.attributes.slug}`)
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
      article: data?.articles?.data?.[0] ?? null,
      latestArticles: data?.moreArticles?.data ?? [],
      preview: !!preview,
    },
    revalidate: 1,
  }
}

interface ArticlePage {
  article?: ArticleEntity
  latestArticles?: ArticleEntity[]
  preview: boolean
}

const ArticlePage: FC<ArticlePage> = ({ article, latestArticles, preview }) => {
  const router = useRouter()
  const tableOfContents = article?.attributes?.staticTableOfContents?.entries
  const tableOfContentsFiltered = tableOfContents?.filter((el) =>
    article?.attributes?.blocks?.some((block) => block && 'key' in block && block.key === el?.key)
  )
  const { isSm } = useBreakpoint('sm')
  const [selectedHeader, setSelectedHeader] = useState<Maybe<string> | undefined>()

  const scrollToHeader = useCallback(
    (id: Maybe<string> | undefined) => {
      const el = id ? document.getElementById(id) : undefined
      if (el) {
        const padding = isSm ? 24 : 180
        const offset = el.getBoundingClientRect().top + window.scrollY - APP_HEADER_HEIGHT - padding
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        })
      }
    },
    [isSm]
  )

  if (!router.isFallback && !article?.attributes?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <LoadingOverlay show={!article} />
      <ArticleSeo article={article?.attributes} />
      <Container maxWidth="6xl" className="mx-auto">
        <PreviewBanner show={preview} />
        <Breadcrumb article={article} />
        <ArticleHeader article={article} />
        {article?.attributes?.cover.data && (
          <div className="relative mt-10 aspect-[1152/512] sm:mt-12">
            <Image image={article?.attributes.cover.data} />
          </div>
        )}

        <div className="pb-20 mx-auto sm:pb-36">
          {tableOfContentsFiltered && (
            <ArticleHeaderSelector
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              tableOfContents={tableOfContentsFiltered}
              scrollToHeader={scrollToHeader}
            />
          )}

          <div
            className={classNames(
              'sm:grid grid-cols-[min-content,1fr] justify-items-center gap-16 sm:pt-[50px]',
              DEFAULT_SIDE_PADDING
            )}
          >
            <aside className="flex-col hidden w-full gap-8 min-w-[180px] max-w-[280px] sm:flex sticky h-fit top-28">
              <ArticleLinks article={article} />
              <hr className="border border-slate-200/5" />
              <ol className="grid gap-8 list-decimal list-inside">
                {tableOfContentsFiltered?.map((el) => (
                  <li
                    key={el?.key}
                    className={classNames(
                      'hover:text-slate-50 font-medium text-base cursor-pointer',
                      selectedHeader === el?.key ? 'text-slate-50' : 'text-slate-400'
                    )}
                    onClick={() => {
                      scrollToHeader(el?.key)
                      setSelectedHeader(el?.text)
                    }}
                  >
                    {el?.text}
                  </li>
                ))}
              </ol>
            </aside>
            <article className="prose !prose-invert prose-slate">
              {article?.attributes?.blocks?.map((b, i) => {
                if (b && '__typename' in b) {
                  const block = b as ArticleBlocksDynamicZone & {
                    __typename: 'ComponentSharedDivider' | 'ComponentSharedMedia' | 'ComponentSharedRichText'
                  }

                  switch (block.__typename) {
                    case 'ComponentSharedDivider':
                      return <hr key={i} className="my-12 border border-slate-200/5" />
                    case 'ComponentSharedMedia':
                      return <MediaBlock block={block as ComponentSharedMedia} key={i} />
                    default:
                      return <RichTextBlock block={block as ComponentSharedRichText} key={i} />
                  }
                }
              })}
            </article>
          </div>

          <ArticleFooter articles={latestArticles} />
        </div>
      </Container>
    </>
  )
}

export default ArticlePage
