import { SearchIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { Container, Typography } from '@sushiswap/ui'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleList, ArticleListItem, Categories, Pagination, Seo } from '../components'
import { fetchAPI } from '../lib/api'
import { Article, Category, Data } from '../types'

export async function getStaticProps() {
  const [articles, categories] = await Promise.all([
    fetchAPI('/articles', {
      populate: 'deep',
      sort: ['publishedAt:desc'],
      pagination: {
        limit: 12,
      },
    }),
    fetchAPI('/categories', { populate: '*' }),
  ])

  return {
    props: {
      fallback: {
        ['/articles']: articles,
        ['/categories']: categories,
      },
    },
    revalidate: 1,
  }
}

const Archive: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Archive />
    </SWRConfig>
  )
}

const _Archive = () => {
  const [query, setQuery] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const debouncedQuery = useDebounce(query, 200)

  const [selected, setSelected] = useState<number[]>([])
  const { data: articlesData } = useSWR<Data<Article[]>>('/articles', (url) =>
    fetchAPI(url, { populate: 'deep', sort: ['publishedAt:desc'] })
  )
  const { data: categoriesData } = useSWR<Data<Category[]>>('/categories', (url) => fetchAPI(url, { populate: '*' }))
  const { data: filterData, isValidating } = useSWR<Data<Article[]>>(
    [`/articles`, selected, debouncedQuery, page],
    (url, selected, debouncedQuery, page) => {
      return fetchAPI(url, {
        populate: 'deep',
        sort: ['publishedAt:desc'],
        pagination: {
          page,
          pageSize: 10,
        },
        filters: {
          ...(debouncedQuery && { title: { $containsi: debouncedQuery } }),
          categories: {
            id: {
              $in: selected,
            },
          },
        },
      })
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: false }
  )

  const loading = useDebounce(isValidating, 400)

  const articles = articlesData?.data
  const categories = categoriesData?.data
  const articleList = selected && filterData?.data ? filterData?.data : articles ? articles : []
  const articlesMeta =
    selected && filterData?.meta ? filterData.meta : articlesData?.meta ? articlesData.meta : undefined

  return (
    <>
      <Seo />
      <Container maxWidth="5xl" className="mx-auto px-4 h-[52px] flex items-center justify-between">
        <Link href="/" passHref={true}>
          <a className="group flex gap-3 items-center">
            <ChevronLeftIcon width={18} className="text-slate-400 group-hover:text-slate-50" />
            <Typography variant="lg" weight={700} className="text-lg group-hover:text-slate-50 text-slate-200">
              Archive
            </Typography>
          </a>
        </Link>
      </Container>
      <div className="flex flex-col divide-y divide-slate-800">
        <section className="py-4 pb-60">
          <Container maxWidth="5xl" className="mx-auto px-4 space-y-8">
            <div className="flex flex-col gap-y-8 md:flex-row items-center justify-between">
              <div className="order-2 md:order-1 flex items-center gap-3">
                <div className="text-sm font-bold text-slate-400 mr-2">Categories</div>
                <Categories selected={selected} onSelect={setSelected} categories={categories || []} />
              </div>
              <div className="w-full md:w-auto order-1 md:order-2 flex items-center gap-3 rounded-xl bg-slate-800 px-3 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full font-bold placeholder:text-sm h-[40px] text-slate-300 bg-transparent text-base !ring-0 !outline-0"
                  placeholder="Search in Archive..."
                />
                <SearchIcon width={24} height={24} className="text-slate-500" />
              </div>
            </div>
            <div className="divide-y divide-slate-200/5 border-t border-slate-200/5 border-b">
              <ArticleList
                articles={articleList}
                loading={loading}
                render={(article) => (
                  <ArticleListItem article={article} key={`article__left__${article.attributes.slug}`} />
                )}
              />
            </div>
            <div className="flex justify-center">
              {articlesMeta && (
                <Pagination
                  page={articlesMeta.pagination.page}
                  onPage={setPage}
                  pages={articlesMeta.pagination.pageCount}
                />
              )}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Archive
