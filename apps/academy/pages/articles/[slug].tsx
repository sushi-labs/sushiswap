import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { classNames, Container, Select } from '@sushiswap/ui'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { defaultSidePadding } from 'pages'
import { FC } from 'react'

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
        <div className="relative w-screen h-[calc(100vw/3)] min-h-[300px] mt-6 md:mt-12">
          <Image image={article?.attributes.cover.data} />
        </div>
      )}

      <Container maxWidth="6xl" className="pb-20 mx-auto md:pb-36">
        <div>
          <div className="sticky top-[94px] md:hidden bg-slate-900 z-20 px-6 border-b border-slate-200/5">
            <Select
              button={
                <Listbox.Button
                  type="button"
                  className="flex items-center justify-between w-full h-12 gap-1 px-6 font-medium hover:text-slate-200 text-slate-300"
                >
                  <span className="text-sm">Intro</span>
                  <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                </Listbox.Button>
              }
            >
              <Select.Options className="p-6 !bg-slate-800 -mt-1">
                <option>1</option>
                <option>2</option>
              </Select.Options>
            </Select>
          </div>

          <div className={classNames('flex justify-center gap-16 md:pt-14', defaultSidePadding)}>
            <aside className="flex-col hidden w-full gap-8 min-w-[180px] max-w-[280px] md:flex">
              <ArticleLinks article={article} />
              <hr className="border border-slate-200/5" />
              <div className="space-y-8">
                Article headers here
                {/* {article?.attributes?.blocks?.map((block, i) => {
                // @ts-ignore
                if (block?.__typename === 'ComponentSharedRichText') {
                  // checks for markdown headers, any text that starts with '#'
                  const headerRegex = new RegExp('(#{1,6} .*)\r?\n')
                  // @ts-ignore
                  const hit = headerRegex.exec(block.body)
                  const header = hit?.[0].replaceAll('#', '')
                  console.log(i, header)
                  return (
                    <a key={i} href={`#${header}`}>
                      {header}
                    </a>
                  )
                }
              })} */}
              </div>
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
        </div>

        <ArticleFooter articles={latestArticles} />
      </Container>
    </>
  )
}

export default ArticlePage
