import { Listbox } from '@headlessui/react'
import { ArrowsUpDownIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Container, Select, Typography } from '@sushiswap/ui'
import { defaultSidePadding, sortingOptions } from 'common/helpers'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, CategoryEntityResponseCollection } from '../../.mesh'
import {
  ArticleList,
  ArticlesPageHeader,
  Card,
  GradientWrapper,
  Pagination,
  SearchInput,
} from '../../common/components'
import { getArticles, getCategories, getDifficulties } from '../../lib/api'

export async function getStaticProps() {
  // const articles = await getArticles({ pagination: { limit: 6 } })
  const categories = await getCategories()
  const difficulties = await getDifficulties()

  return {
    props: {
      fallback: {
        // ['/articles']: articles?.articles,
        ['/categories']: categories?.categories,
        ['/difficulties']: difficulties?.categories,
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
  const queryParams = router.query as {
    difficulty: string | undefined
    category: string | undefined
    search: string | undefined
  }
  const { difficulty, category, search } = queryParams

  const [sortBy, setSortBy] = useState(sortingOptions[0])
  const [selectedCategory, setSelectedCategory] = useState<string>(category)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(difficulty)

  const { data: articlesData, isValidating } = useSWR(
    [`/articles`, selectedCategory, selectedDifficulty, debouncedQuery, page, sortBy.key],
    async (_url, categoryFilter, difficultyFilter, debouncedQuery, page, sortKey) => {
      return (
        await getArticles({
          filters: {
            ...((debouncedQuery || search) && { title: { containsi: debouncedQuery ?? search } }),
            ...((categoryFilter || difficultyFilter) && {
              categories: {
                // TODO: this doesn't work, but leave for now until defficulties are it's own collection type in strapi
                ...(categoryFilter && { id: { eq: categoryFilter } }),
                ...(difficultyFilter && { and: [{ id: { eq: difficultyFilter } }] }),
              },
            }),
          },
          pagination: { page, pageSize: 10 },
          sort: [sortKey],
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: true }
  )

  const { data: categoriesData } = useSWR<CategoryEntityResponseCollection>('/categories')
  const { data: difficultiesData } = useSWR<CategoryEntityResponseCollection>('/difficulties')

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const categories = categoriesData?.data
  const difficulties = difficultiesData?.data
  const articleList = articles ?? undefined

  const articlesMeta = articlesData?.meta ? articlesData.meta : undefined

  const handleSelectDifficulty = (id: string) =>
    setSelectedDifficulty((currentDifficulty) => (currentDifficulty === id ? undefined : id))
  const handleSelectCategory = (id: string) =>
    setSelectedCategory((currentCategory) => (currentCategory === id ? undefined : id))

  // TODO: strapi
  const products = ['Bentobox', 'Furo', 'Kashi', 'etc']

  const articlesAmount = articlesMeta?.pagination?.total ?? 0
  const headerTitle = useMemo(() => {
    let title = 'Latest releases'
    if (difficulty === 'beginner') title = 'Tutorials & Product Explainers'
    if (difficulty === 'advanced') title = 'Strategies & Product Features'
    if (search) title = 'Search results'
    return title
  }, [difficulty, search])

  return (
    <>
      <SearchInput isTopOfPage hideTopics className="w-full sm:hidden" handleSearch={setQuery} />
      <ArticlesPageHeader
        title={headerTitle}
        difficulties={difficulties}
        selectedDifficulty={selectedDifficulty}
        handleSelectDifficulty={handleSelectDifficulty}
      />
      <Container maxWidth="6xl" className={classNames('mx-auto pb-10', defaultSidePadding)}>
        <div className="grid grid-cols-2 w-full gap-3 sm:hidden mt-[22px]">
          <Select
            button={
              <GradientWrapper className="w-full rounded-lg h-9">
                <Listbox.Button
                  type="button"
                  className="flex items-center justify-between w-full h-full gap-1 px-4 text-xs font-medium rounded-lg bg-slate-800 text-slate-50"
                >
                  {selectedDifficulty
                    ? difficulties?.find(({ id }) => id === selectedDifficulty)?.attributes?.name ?? 'Select Difficulty'
                    : 'Select Difficulty'}
                  <ChevronDownIcon width={12} height={12} aria-hidden="true" />
                </Listbox.Button>
              </GradientWrapper>
            }
          >
            <Select.Options className="!bg-slate-700 p-6 gap-6 flex flex-col">
              {difficulties?.map(({ id, attributes }, i) => (
                <Typography weight={500} variant="sm" key={i} onClick={() => handleSelectDifficulty(id)}>
                  {attributes.name}
                </Typography>
              ))}
            </Select.Options>
          </Select>
          <Select
            values={sortingOptions}
            onChange={setSortBy}
            button={
              <Listbox.Button
                type="button"
                className="flex items-center justify-between w-full gap-3 px-4 text-xs font-medium border rounded-lg whitespace-nowrap bg-slate-800 h-9 text-slate-50 border-slate-700"
              >
                <span className="flex gap-2">
                  <ArrowsUpDownIcon width={14} height={14} />
                  {sortBy.name}
                </span>
                <ChevronDownIcon width={12} height={12} aria-hidden="true" />
              </Listbox.Button>
            }
          >
            <Select.Options className="!bg-slate-700 p-2">
              {sortingOptions?.map((option) => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className="flex items-center px-2 text-xs rounded-lg cursor-pointer h-9 hover:bg-blue-500 transform-all"
                >
                  {option.name}
                </Listbox.Option>
              ))}
            </Select.Options>
          </Select>
        </div>

        <Container
          maxWidth="full"
          className="sm:grid sm:grid-cols-[min-content,1fr] justify-between gap-8 mx-auto lg:gap-12 mt-[22px] sm:mt-12"
        >
          <aside className="flex-col hidden w-full min-w-[180px] max-w-[280px] sm:flex sticky h-fit top-[104px]">
            <div className="flex items-center w-full gap-3 px-4 rounded-lg h-11 bg-slate-800 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
              <MagnifyingGlassIcon width={24} height={24} className="text-slate-50" />
              <input
                onChange={(e) => setQuery(e.target.value)}
                className="font-medium placeholder:text-sm bg-transparent placeholder:text-slate-50 text-base !ring-0 !outline-0"
                placeholder="Search Topic..."
                value={query}
              />
            </div>
            <div className="flex flex-col gap-6 pl-3 mt-12">
              {products.map((product) => (
                <Typography
                  className="hover:underline text-slate-300 w-fit"
                  key={product}
                  onClick={() => setQuery(product)}
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
                <div className="flex items-center justify-between">
                  <Typography weight={500}>{articlesAmount} Results</Typography>
                  <Select
                    values={sortingOptions}
                    onChange={setSortBy}
                    className="hidden sm:flex"
                    button={
                      <Listbox.Button
                        type="button"
                        className="px-4 bg-slate-800 w-[250px] text-sm flex items-center h-11 rounded-lg text-slate-50 border border-slate-700 relative"
                      >
                        <Typography className="text-slate-500">Sort by:</Typography>
                        <Typography className="ml-2">{sortBy.name}</Typography>
                        <ChevronDownIcon width={12} height={12} className="absolute right-4" aria-hidden="true" />
                      </Listbox.Button>
                    }
                  >
                    <Select.Options className="!bg-slate-700 p-2">
                      {sortingOptions?.map((option) => (
                        <Listbox.Option
                          key={option.key}
                          value={option}
                          className="flex items-center h-10 px-2 cursor-pointer hover:bg-blue-500 rounded-xl transform-all"
                        >
                          {option.name}
                        </Listbox.Option>
                      ))}
                    </Select.Options>
                  </Select>
                </div>
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] sm:mt-12 mt-[22px]">
                  <ArticleList
                    articles={articleList as unknown as ArticleEntity[]}
                    loading={loading || !articleList}
                    render={(article, i) => (
                      <Card article={article} key={`article__left__${article?.attributes?.slug}`} />
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
