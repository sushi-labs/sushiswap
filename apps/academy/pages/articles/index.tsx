import { Listbox } from '@headlessui/react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Container, Select, Typography } from '@sushiswap/ui'
import { Pane } from 'components/Pane'
import { useRouter } from 'next/router'
import { defaultSidePadding } from 'pages'
import { FC, useState } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '../../.mesh'
import { ArticleList, Pagination } from '../../components'
import { getArticles, getCategories, getLevels } from '../../lib/api'

type SortBy = 'relevance' | 'dateAsc' | 'dateDesc' | 'author'

const Articles: FC = () => {
  const [query, setQuery] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const debouncedQuery = useDebounce(query, 200)
  const router = useRouter()

  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [selectedCategory, setSelectedCategory] = useState<string>(router.query.category as string | undefined)
  const [selectedLevel, setSelectedLevel] = useState<string>(router.query.level as string | undefined)

  const { data: articlesData, isValidating } = useSWR(
    [`/articles`, selectedCategory, selectedLevel, debouncedQuery, page],
    async (_url, categoryFilter, levelFilter, debouncedQuery, page) => {
      return (
        await getArticles({
          filters: {
            ...(debouncedQuery && { title: { containsi: debouncedQuery } }),
            // ...((router.query.level || router.query.category) && {
            ...((categoryFilter || levelFilter) && {
              categories: {
                // TODO: this doesn't work, but leave for now until levels are it's own collection type in strapi
                ...(categoryFilter && { id: { eq: categoryFilter } }),
                ...(levelFilter && { and: [{ id: { eq: levelFilter } }] }),
              },
            }),
          },
          pagination: { page, pageSize: 10 },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: true }
  )

  const { data: categoriesData } = useSWR('/categories', async () => (await getCategories())?.categories)
  const { data: levelsData } = useSWR('/levels', async () => (await getLevels())?.categories)

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const categories = categoriesData?.data
  const levels = levelsData?.data
  const articleList = articles ? articles : undefined

  const articlesMeta = articlesData?.meta ? articlesData.meta : undefined

  const handleSelectLevel = (id: string) => setSelectedLevel((currentLevel) => (currentLevel === id ? undefined : id))
  const handleSelectCategory = (id: string) =>
    setSelectedCategory((currentCategory) => (currentCategory === id ? undefined : id))

  // TODO: strapi
  const products = ['Bentobox', 'Furo', 'Kashi', 'etc']

  const sortOptions: SortBy[] = ['relevance', 'dateAsc', 'dateDesc', 'author']
  const SearchInput = () => (
    <div className="flex items-center w-full gap-2 pl-3 rounded-lg md:w-auto bg-slate-800 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
      <SearchIcon width={24} height={24} className="text-slate-500" />
      <input
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-14 font-medium placeholder:text-sm text-slate-300 bg-transparent text-base !ring-0 !outline-0"
        placeholder="Search Topic"
      />
    </div>
  )

  return (
    <>
      <Container maxWidth="6xl" className={classNames('mx-auto sm:py-24 py-11', defaultSidePadding)}>
        <Container maxWidth="full" className="flex items-center justify-between">
          <div className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row">
            <div className="flex flex-col items-center w-full gap-2 sm:items-start">
              <span className="font-medium font-base sm:text-lg">Articles</span>
              <span className="text-3xl font-medium text-center sm:text-left sm:text-5xl">Tutorials & Explainers</span>
            </div>
            <div className="flex flex-col items-center w-full gap-3 sm:w-auto">
              <div className="w-full sm:hidden">
                <SearchInput />
              </div>
              <div className="flex w-full gap-5">
                <Select
                  className="w-1/2 sm:w-auto"
                  button={
                    <Listbox.Button
                      type="button"
                      className="w-full sm:w-32 flex items-center justify-between pl-4 h-11 sm:h-10 gap-1 font-medium rounded-lg sm:rounded-full hover:text-slate-200 text-slate-300 border border-[#d9d9d9]"
                    >
                      <span className="text-xs sm:text-sm">
                        {selectedLevel
                          ? levels?.find(({ id }) => id === selectedLevel).attributes.name ?? 'Select Level'
                          : 'Select Level'}
                      </span>
                      <ChevronDownIcon className="absolute w-2 h-2 right-4" aria-hidden="true" />
                    </Listbox.Button>
                  }
                >
                  <Select.Options className="w-32 !bg-slate-700 p-6 gap-6 flex flex-col">
                    {levels?.map(({ id, attributes }, i) => (
                      <Typography weight={500} variant="sm" key={i} onClick={() => handleSelectLevel(id)}>
                        {attributes.name}
                      </Typography>
                    ))}
                  </Select.Options>
                </Select>
                <Select
                  className="w-1/2 sm:w-auto"
                  button={
                    // TODO: PRODUCTS
                    <Listbox.Button
                      type="button"
                      className="w-full sm:w-32 flex items-center justify-between h-11 sm:h-10 pl-4 font-medium rounded-lg sm:rounded-full hover:text-slate-200 text-slate-300 border border-[#d9d9d9]"
                    >
                      <span className="text-xs sm:text-sm">
                        {selectedLevel
                          ? levels?.find(({ id }) => id === selectedLevel).attributes.name ?? 'Select Level'
                          : 'Select Level'}
                      </span>
                      <ChevronDownIcon className="absolute w-2 h-2 right-4" aria-hidden="true" />
                    </Listbox.Button>
                  }
                >
                  <Select.Options className="w-32 !bg-slate-700 p-6 gap-6 flex flex-col">
                    {levels?.map(({ id, attributes }, i) => (
                      <Typography weight={500} variant="sm" key={i} onClick={() => handleSelectLevel(id)}>
                        {attributes.name}
                      </Typography>
                    ))}
                  </Select.Options>
                </Select>
              </div>
            </div>
          </div>
        </Container>

        <Container maxWidth="full" className="flex gap-12 mx-auto mt-6 sm:mt-24">
          <aside className="flex-col hidden w-64 gap-8 md:flex">
            <SearchInput />
            <div className="flex flex-col gap-6 pl-3">
              {products.map((product) => (
                <Typography
                  className="hover:underline"
                  weight={500}
                  key={product}
                  onClick={() => null /** TODO: implement */}
                >
                  {product}
                </Typography>
              ))}
            </div>
          </aside>

          <div className="w-full">
            {articleList && !articleList.length ? (
              <Typography variant="lg">No articles found</Typography>
            ) : (
              <>
                <div className="items-center justify-between hidden sm:flex">
                  {articlesMeta?.pagination?.total > 0 && (
                    <Typography weight={500}>{articlesMeta.pagination.total} Results</Typography>
                  )}

                  <Select
                    button={
                      // TODO: sortby
                      <Listbox.Button
                        type="button"
                        className="pl-20 w-48 flex items-center h-14 font-medium rounded-lg hover:text-slate-200 text-slate-300 border border-[#d9d9d9]"
                      >
                        <Typography className="absolute text-sm left-4">Sortby:</Typography>
                        <Typography className="text-sm">{sortBy}</Typography>
                        <ChevronDownIcon className="absolute w-2 h-2 right-4" aria-hidden="true" />
                      </Listbox.Button>
                    }
                  >
                    <Select.Options className="w-32 !bg-slate-700 p-6 gap-6 flex flex-col">
                      {sortOptions?.map((key) => (
                        <Typography weight={500} variant="sm" key={key} onClick={() => setSortBy(key)}>
                          {key}
                        </Typography>
                      ))}
                    </Select.Options>
                  </Select>
                </div>
                <div className="grid grid-cols-1 transition-all gap-x-6 sm:grid-cols-2 gap-y-10 sm:mt-8">
                  <ArticleList
                    articles={articleList as ArticleEntity[]}
                    loading={loading || !articleList}
                    render={(article, i) => (
                      <Pane
                        article={article}
                        isBig={page === 1 && !i}
                        key={`article__left__${article?.attributes?.slug}`}
                      />
                    )}
                  />
                </div>
              </>
            )}
            <div className="flex justify-center mt-12">
              {articlesMeta?.pagination?.pageCount > 0 && (
                <Pagination
                  page={articlesMeta.pagination.page}
                  onPage={setPage}
                  pages={articlesMeta.pagination.pageCount}
                />
              )}
            </div>
          </div>
        </Container>
      </Container>
    </>
  )
}

export default Articles
