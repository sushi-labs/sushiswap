import { Listbox } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon, SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { Button, Container, Select, Typography } from '@sushiswap/ui'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, ArticleEntityResponseCollection, CategoryEntityResponseCollection } from '../../.mesh'
import { ArticleList, ArticleListItem, Categories, Pagination } from '../../components'
import { getArticles, getCategories } from '../../lib/api'

export async function getStaticProps() {
  const articles = await getArticles()
  const categories = await getCategories()

  return {
    props: {
      fallback: {
        ['/articles']: articles?.articles,
        ['/categories']: categories?.categories,
      },
    },
    revalidate: 1,
  }
}

const Articles: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Articles />
    </SWRConfig>
  )
}

const _Articles: FC = () => {
  const [query, setQuery] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const debouncedQuery = useDebounce(query, 200)
  const router = useRouter()

  // const { data: articlesData } = useSWR<ArticleEntityResponseCollection>('/articles', async () => {
  const { data: articlesData } = useSWR(
    ['/articles'],
    async () => {
      return (
        await getArticles({
          filters: {
            ...((router.query.level || router.query.category) && {
              categories: {
                slug: { in: [router.query.level as string, router.query.category as string].filter(Boolean) },
              },
            }),
          },
        })
      )?.articles
    }
    // { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: true }
  )
  const { data: categoriesData } = useSWR<CategoryEntityResponseCollection>('/categories')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoriesData?.data.find((c) => c.attributes.slug === (router.query.category as string))?.id
  )
  const [selectedLevel, setSelectedLevel] = useState<string>(
    categoriesData?.data.find((c) => c.attributes.slug === (router.query.level as string))?.id
  )
  const { data: filterData, isValidating } = useSWR(
    [`/articles`, selectedCategory, selectedLevel, debouncedQuery, page],
    async (url, categoryFilter, levelFilter, debouncedQuery, page) => {
      return (
        await getArticles({
          filters: {
            ...(debouncedQuery && { title: { containsi: debouncedQuery } }),
            ...((categoryFilter || levelFilter) && {
              categories: {
                id: {
                  in: [categoryFilter, levelFilter].filter(Boolean),
                },
              },
            }),
          },
          pagination: { page, pageSize: 10 },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: false }
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const categories = categoriesData?.data
  // const articleList = selectedCategory && filterData?.data ? filterData?.data : articles ? articles : []
  const articleList =
    (selectedCategory || selectedLevel) && filterData?.data ? filterData.data : articles ? articles : undefined
  const articlesMeta =
    selectedCategory && filterData?.meta ? filterData.meta : articlesData?.meta ? articlesData.meta : undefined

  return (
    <>
      {/* <Container maxWidth="6xl" className="mx-auto px-4 h-[86px] flex items-center justify-between"> */}
      <Container maxWidth="6xl" className="flex items-center justify-between mx-auto mt-24">
        <div>
          <Typography variant="lg" weight={500} className="">
            Articles
          </Typography>
          <Typography variant="hero" weight={500} className="mt-3">
            Tutorials & Explainers
          </Typography>
        </div>
        <div>
          <Select
            button={
              <Listbox.Button
                type="button"
                className="flex items-center h-10 gap-1 px-4 font-medium rounded-full hover:text-slate-200 text-slate-300 border border-[#d9d9d9]"
              >
                <span className="text-sm">Beginner</span>
                <ChevronDownIcon className="w-2 h-2" aria-hidden="true" />
              </Listbox.Button>
            }
          >
            <Select.Options className="w-[217px] max-w-[240px] !bg-slate-700 -ml-5 mt-5 max-h-[unset] p-6 gap-6 flex flex-col">
              {/* {options.map(({ option, href }, i) => ( */}
              <Typography weight={500} variant="sm">
                he
              </Typography>
              {/* ))} */}
            </Select.Options>
          </Select>
        </div>
      </Container>
      <div className="flex flex-col divide-y divide-slate-800">
        <section className="py-4 pb-60">
          <Container maxWidth="5xl" className="px-4 mx-auto space-y-8">
            <div className="flex flex-col items-center justify-between gap-y-8 md:flex-row">
              <div className="flex items-center order-2 gap-3 md:order-1">
                <div className="mr-2 text-sm font-medium text-slate-400">Categories</div>
                <Categories selected={selectedCategory} onSelect={setSelectedCategory} categories={categories || []} />
              </div>
              <div className="flex items-center order-1 w-full gap-3 px-3 md:w-auto md:order-2 rounded-xl bg-slate-800 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                <input
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full font-medium placeholder:text-sm h-[40px] text-slate-300 bg-transparent text-base !ring-0 !outline-0"
                  placeholder="Search in Archive..."
                />
                <SearchIcon width={24} height={24} className="text-slate-500" />
              </div>
            </div>
            <div className="border-t border-b divide-y divide-slate-200/5 border-slate-200/5">
              {articleList && (
                <ArticleList
                  articles={articleList as ArticleEntity[]}
                  loading={loading}
                  render={(article) => (
                    <ArticleListItem article={article} key={`article__left__${article?.attributes?.slug}`} />
                  )}
                />
              )}
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

export default Articles
