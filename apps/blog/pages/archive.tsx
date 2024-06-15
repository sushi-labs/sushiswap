import { ChevronLeftIcon, SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { LinkInternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import type { InferGetServerSidePropsType } from 'next'
import type { FC } from 'react'
import { useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import type { Article, Category, Collection } from 'types'
import {
  ArticleList,
  ArticleListItem,
  Categories,
  Pagination,
} from '../components'
import { getArticles, getCategories } from '../lib/api'

export async function getStaticProps() {
  const articles = await getArticles()
  const categories = await getCategories()

  return {
    props: {
      fallback: {
        '/articles': articles.articles || [],
        '/categories': categories.categories || [],
      },
    },
    revalidate: 1,
  }
}

const Archive: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({
  fallback,
}) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Archive />
    </SWRConfig>
  )
}

const _Archive: FC = () => {
  const [query, setQuery] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const debouncedQuery = useDebounce(query, 200)

  const [selected, setSelected] = useState<string[]>([])
  const { data: articlesData } = useSWR<Collection<Article>>('/articles')
  const { data: categoriesData } = useSWR<Collection<Category>>('/categories')
  const { data: filterData, isValidating } = useSWR(
    ['/articles', selected, debouncedQuery, page],
    async ([_url, selected, debouncedQuery, page]) => {
      return (
        await getArticles({
          filters: {
            ...(debouncedQuery && { title: { containsi: debouncedQuery } }),
            ...(selected.length > 0 && {
              categories: {
                id: {
                  in: selected,
                },
              },
            }),
          },
          pagination: { page, pageSize: 10 },
        })
      ).articles
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  )

  const loading = useDebounce(isValidating, 300)

  const articles = articlesData?.data
  const categories = categoriesData?.data
  const articleList =
    selected && filterData?.data ? filterData.data : articles ? articles : []
  const articlesMeta =
    selected && filterData?.meta
      ? filterData.meta
      : articlesData?.meta
        ? articlesData.meta
        : undefined

  return (
    <>
      <Container
        className="mx-auto px-4 h-[86px] flex items-center justify-between"
        maxWidth="5xl"
      >
        <LinkInternal className="flex items-center gap-3 group" href="/">
          <ChevronLeftIcon
            className="text-slate-400 group-hover:text-slate-50"
            width={18}
          />
          <p className="text-lg font-medium text-lg group-hover:text-slate-50 text-slate-200">
            Archive
          </p>
        </LinkInternal>
      </Container>
      <div className="flex flex-col divide-y divide-slate-800">
        <section className="py-4 pb-60">
          <Container className="px-4 mx-auto space-y-8" maxWidth="5xl">
            <div className="flex flex-col items-center justify-between gap-y-8 md:flex-row">
              <div className="flex items-center order-2 gap-3 md:order-1">
                <div className="mr-2 text-sm font-medium text-slate-400">
                  Categories
                </div>
                <Categories
                  categories={categories || []}
                  onSelect={setSelected}
                  selected={selected}
                />
              </div>
              <div className="flex items-center order-1 w-full gap-3 px-3 md:w-auto md:order-2 rounded-xl bg-slate-800 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                <input
                  className="w-full font-medium placeholder:text-sm h-[40px] text-slate-300 bg-transparent text-base !ring-0 !outline-0"
                  onChange={(e) => {
                    setQuery(e.target.value)
                  }}
                  placeholder="Search in Archive..."
                />
                <SearchIcon className="text-slate-500" height={24} width={24} />
              </div>
            </div>
            <div className="border-t border-b divide-y divide-slate-200/5 border-slate-200/5">
              {articleList ? (
                <ArticleList
                  articles={articleList as Article[]}
                  loading={loading}
                  render={(article) => (
                    <ArticleListItem
                      article={article}
                      key={`article__left__${article.attributes.slug}`}
                    />
                  )}
                />
              ) : null}
            </div>
            <div className="flex justify-center">
              {articlesMeta ? (
                <Pagination
                  onPage={setPage}
                  page={articlesMeta.pagination.page}
                  pages={articlesMeta.pagination.pageCount}
                />
              ) : null}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Archive
