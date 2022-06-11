import { SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { Button, Container } from '@sushiswap/ui'
import { InferGetServerSidePropsType } from 'next'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleList, Card, Categories, Hero, Seo } from '../components'
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

const Home: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Home />
    </SWRConfig>
  )
}

const _Home: FC = () => {
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 200)

  const [selected, setSelected] = useState<number[]>([])
  const { data: articlesData } = useSWR<Data<Article[]>>('/articles', (url) =>
    fetchAPI(url, { populate: 'deep', sort: ['publishedAt:desc'] })
  )
  const { data: categoriesData } = useSWR<Data<Category[]>>('/categories', (url) => fetchAPI(url, { populate: '*' }))
  const { data: filterData, isValidating } = useSWR<Data<Article[]>>(
    [`/articles`, selected, debouncedQuery],
    (url, selected, debouncedQuery) => {
      return fetchAPI(url, {
        populate: 'deep',
        sort: ['publishedAt:desc'],
        pagination: {
          limit: 12,
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

  return (
    <>
      <Seo />
      <div className="flex flex-col divide-y divide-slate-800">
        {articles?.[0] && <Hero article={articles[0]} />}
        <section className="py-10 pb-60">
          <Container maxWidth="5xl" className="mx-auto px-4 space-y-10">
            <div className="flex flex-col gap-y-8 md:flex-row items-center justify-between">
              <div className="order-2 md:order-1 overflow-hidden w-full">
                <div className="flex gap-3 flex-wrap">
                  <Categories selected={selected} onSelect={setSelected} categories={categories || []} />
                </div>
              </div>
              <div className="w-full md:w-auto order-1 md:order-2 flex items-center gap-3 rounded-xl bg-slate-800 px-3 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                <SearchIcon width={24} height={24} className="text-slate-500" />
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full font-bold placeholder:text-sm h-[40px] text-slate-300 bg-transparent text-base !ring-0 !outline-0"
                  placeholder="Search Article"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all">
              <ArticleList
                articles={articleList}
                loading={loading}
                render={(article) => <Card article={article} key={`article__left__${article.attributes.slug}`} />}
              />
            </div>
            <div className="flex justify-center">
              <Button as="a" href="/blog/archive" color="gray" variant="outlined" className="rounded-full px-6">
                View Archive
              </Button>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
