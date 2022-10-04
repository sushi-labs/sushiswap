import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { classNames, Container, Select, Typography } from '@sushiswap/ui'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { defaultSidePadding } from 'pages'
import { FC, useState } from 'react'

import { ArticleEntity, ComponentSharedMedia, ComponentSharedRichText } from '../../.mesh'
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
} from '../../common/components'
import { Image } from '../../common/components/Image'
import { getAllArticlesBySlug, getArticleAndMoreArticles } from '../../lib/api'

export async function getStaticPaths() {
  const allArticles = await getAllArticlesBySlug()
  return {
    paths: allArticles.articles?.data.reduce<string[]>((acc, article) => {
      if (article?.attributes?.slug) acc.push(`/articles/${article?.attributes.slug}`)

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
  console.log('params', params)
  console.log('preview', preview)
  const data = await getArticleAndMoreArticles(params.slug, preview)

  return {
    props: {
      // @ts-ignore
      article: data?.articles?.data?.[0],
      // @ts-ignore
      latestArticles: data?.moreArticles?.data, // TODO: similar articles
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
  const headers = article?.attributes?.blocks?.map(({ key }) => key)?.filter(Boolean)
  const [selectedHeader, setSelectedHeader] = useState('')
  if (!router.isFallback && !article?.attributes?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <ArticleSeo article={article?.attributes} />
      <PreviewBanner show={preview} />
      <Breadcrumb />
      <Container maxWidth="3xl" className="px-4 mx-auto mt-8 md:mt-0">
        <ArticleHeader article={article} />
        <ArticleAuthors article={article} />
      </Container>
      {article?.attributes?.cover.data && (
        <div className="relative w-screen h-[calc(100vw/2.85)] min-h-[300px] mt-10 md:mt-[50px]">
          <Image image={article?.attributes.cover.data} />
        </div>
      )}

      <Container maxWidth="6xl" className="pb-20 mx-auto md:pb-36">
        <Disclosure as="div" className="sticky top-[94px] md:hidden bg-slate-900 z-20 px-6 border-b border-slate-200/5">
          {({ open, close }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full h-12 gap-1 text-slate-40 outline-0">
                <Typography variant="sm" weight={500}>
                  {selectedHeader || (headers && headers[0])}
                </Typography>
                <ChevronDownIcon width={12} height={12} className={classNames('transition', open && 'rotate-180')} />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="grid gap-3 pb-6">
                  <ol className="grid gap-3 list-decimal list-inside">
                    {headers?.map((header) => (
                      <li
                        key={header}
                        className={classNames(selectedHeader === header ? 'text-slate-50' : 'text-slate-400')}
                        onClick={() => {
                          close()
                          setSelectedHeader(header)
                        }}
                      >
                        <Typography variant="sm" weight={500} as="a" href={`#${header}`}>
                          {header}
                        </Typography>
                      </li>
                    ))}
                  </ol>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
        {/* </div> */}

        <div className={classNames('flex justify-center gap-16 md:pt-14', defaultSidePadding)}>
          <aside className="flex-col hidden w-full gap-8 min-w-[180px] max-w-[280px] md:flex sticky top-0">
            <ArticleLinks article={article} />
            <hr className="border border-slate-200/5" />
            <ol className="grid gap-8 list-decimal list-inside">
              {headers?.map((header) => (
                <li
                  key={header}
                  className={classNames(
                    'hover:text-slate-50',
                    selectedHeader === header ? 'text-slate-50' : 'text-slate-400'
                  )}
                  onClick={() => setSelectedHeader(header)}
                >
                  <Typography as="a" href={`#${header}`} weight={500}>
                    {header}
                  </Typography>
                </li>
              ))}
            </ol>
          </aside>
          <article className="prose !prose-invert prose-slate">
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
                return <hr key={i} className="my-12 border border-slate-200/5" />
              }
            })}
          </article>
        </div>

        <ArticleFooter articles={latestArticles} />
      </Container>
    </>
  )
}

export default ArticlePage
