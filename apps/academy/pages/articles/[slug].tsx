import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { LoadingOverlay } from '@sushiswap/ui/components/loader'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { GhostArticle, addBodyToArticle } from 'lib/ghost'
import { ArticleSchema } from 'lib/validate'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { FC } from 'react'

import {
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  ArticleSeo,
  Breadcrumb,
  Image,
  PreviewBanner,
} from '../../common/components'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../../lib/api'

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug)
        acc.push(`/articles/${article?.attributes.slug}`)
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
      latestArticles: data?.moreArticles?.data ?? [],
      preview: !!preview,
    },
    revalidate: 60,
  }
}

interface ArticlePage {
  article?: GhostArticle
  latestArticles?: GhostArticle[]
  preview: boolean
}

const ArticlePage: FC<ArticlePage> = ({ article, latestArticles, preview }) => {
  const router = useRouter()
  // const tableOfContents = article?.attributes?.staticTableOfContents?.entries
  // const tableOfContentsFiltered = tableOfContents?.filter((el) =>
  //   article?.attributes?.blocks?.some((block) => block && 'key' in block && block.key === el?.key)
  // )
  // const { isSm } = useBreakpoint('sm')
  // const [selectedHeader, setSelectedHeader] = useState<Maybe<string> | undefined>()

  // const scrollToHeader = useCallback(
  //   (id: Maybe<string> | undefined) => {
  //     const el = id ? document.getElementById(id) : undefined
  //     if (el) {
  //       const padding = isSm ? 24 : 180
  //       const offset = el.getBoundingClientRect().top + window.scrollY - APP_HEADER_HEIGHT - padding
  //       window.scrollTo({
  //         top: offset,
  //         behavior: 'smooth',
  //       })
  //     }
  //   },
  //   [isSm]
  // )

  if (!router.isFallback && !article?.attributes?.slug) {
    return <ErrorPage statusCode={404} />
  }

  if (!article) {
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
            {/* eslint-disable-next-line */}
            <Image image={article?.attributes.cover.data} />
          </div>
        )}

        <div className="pb-20 mx-auto sm:pb-36">
          {/* {tableOfContentsFiltered && (
            <ArticleHeaderSelector
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              tableOfContents={tableOfContentsFiltered}
              scrollToHeader={scrollToHeader}
            />
          )} */}

          <div
            className={classNames(
              'sm:grid grid-cols-[min-content,1fr] justify-items-center gap-16 sm:pt-[50px]',
              DEFAULT_SIDE_PADDING,
            )}
          >
            <aside className="flex-col hidden w-full gap-8 min-w-[180px] max-w-[280px] sm:flex sticky h-fit top-28">
              <ArticleLinks article={article} />
              <hr className="border border-slate-200/5" />
              <ol className="grid gap-8 list-decimal list-inside">
                {/* {tableOfContentsFiltered?.map((el) => (
                  <li
                    key={el?.key}
                    className={classNames(
                      'hover:text-slate-50 font-medium text-base cursor-pointer',
                      selectedHeader === el?.key ? 'text-slate-50' : 'text-slate-400'
                    )}
                    onKeyUp={() => {
                      scrollToHeader(el?.key)
                      setSelectedHeader(el?.text)
                    }}
                    onClick={() => {
                      scrollToHeader(el?.key)
                      setSelectedHeader(el?.text)
                    }}
                  >
                    {el?.text}
                  </li>
                ))} */}
              </ol>
            </aside>
            <article className="!prose-invert prose prose-slate">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.attributes.body || '',
                }}
              />
            </article>
          </div>

          <ArticleFooter articles={latestArticles} />
        </div>
      </Container>
    </>
  )
}

export default ArticlePage
