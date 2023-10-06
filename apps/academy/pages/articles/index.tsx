import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@sushiswap/ui/components/select'
import { DEFAULT_SIDE_PADDING, SORTING_OPTIONS } from 'common/helpers'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  DifficultyEntityResponseCollection,
  Maybe,
  ProductEntity,
  ProductEntityResponseCollection,
  TopicEntity,
  TopicEntityResponseCollection,
} from '../../.mesh'
import { ArticleList, ArticlesPageHeader, Card, Pagination, SearchInput } from '../../common/components'
import { getArticles, getDifficulties, getProducts, getTopics } from '../../lib/api'

export async function getStaticProps() {
  const [difficulties, topics, products] = await Promise.all([getDifficulties(), getTopics(), getProducts()])

  return {
    props: {
      fallback: {
        '/difficulties': difficulties?.difficulties,
        '/topics': topics?.topics,
        '/products': products?.products,
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
  const [query, setQuery] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [sortByIndex, setSortByIndex] = useState<string>('0')
  const debouncedQuery = useDebounce(query, 200)
  const [selectedDifficultyIndex, setSelectedDifficultyIndex] = useState<string>()

  const [selectedProduct, setSelectedProduct] = useState<ProductEntity>()
  const [selectedTopic, setSelectedTopic] = useState<TopicEntity>()
  const router = useRouter()
  const queryParams = router.query as {
    difficulty: string | undefined
    product: string | undefined
    topic: string | undefined
    search: string | undefined
  }
  const { difficulty: difficultyQuery, product: productQuery, topic: topicQuery, search: searchQuery } = queryParams
  const { data: difficultiesData } = useSWR<DifficultyEntityResponseCollection>('/difficulties')
  const { data: topicsData } = useSWR<TopicEntityResponseCollection>('/topics')
  const { data: productsData } = useSWR<ProductEntityResponseCollection>('/products')

  const selectedDifficulty = useMemo(
    () => (selectedDifficultyIndex ? (difficultiesData?.data || [])[+selectedDifficultyIndex] : undefined),
    [difficultiesData?.data, selectedDifficultyIndex]
  )

  const sortBy = SORTING_OPTIONS[+sortByIndex]

  useEffect(() => {
    if (router.isReady && difficultyQuery) {
      const searchedDifficulty = difficultiesData?.data?.findIndex(
        ({ attributes }) => attributes?.slug === difficultyQuery
      )

      if (typeof searchedDifficulty === 'number') {
        setSelectedDifficultyIndex(`${searchedDifficulty}`)
      }
    }
  }, [difficultiesData?.data, difficultyQuery, router.isReady])

  useEffect(() => {
    if (router.isReady && productQuery) {
      const searchedProduct = productsData?.data?.find(({ attributes }) => attributes?.slug === productQuery)
      searchedProduct && setSelectedProduct(searchedProduct)
    }
  }, [productQuery, productsData?.data, router.isReady])

  useEffect(() => {
    if (router.isReady && topicQuery) {
      const searchedTopic = topicsData?.data?.find(({ attributes }) => attributes?.slug === topicQuery)
      searchedTopic && setSelectedTopic(searchedTopic)
    }
  }, [router.isReady, topicQuery, topicsData?.data])

  useEffect(() => {
    if (router.isReady && searchQuery) {
      setQuery(searchQuery)
    }
  }, [router.isReady, searchQuery])

  const { data: articlesData, isValidating } = useSWR(
    ['/articles', selectedDifficulty, selectedProduct, selectedTopic, debouncedQuery, page, sortBy.key],
    async ([_url, searchDifficulty, searchProduct, searchTopic, searchInput, searchPage, sortKey]) => {
      const difficultySlug = searchDifficulty?.attributes?.slug
      const productSlug = searchProduct?.attributes?.slug
      const topicSlug = searchTopic?.attributes?.slug

      const filters = {
        ...(searchInput && { title: { containsi: searchInput } }),
        ...(difficultySlug && { difficulty: { slug: { eq: difficultySlug } } }),
        ...(productSlug && { products: { slug: { eq: productSlug } } }),
        ...(topicSlug && { topics: { slug: { eq: topicSlug } } }),
      }

      return await getArticles({
        filters,
        pagination: { page: searchPage, pageSize: 10 },
        sort: [sortKey],
      })
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const difficulties = difficultiesData?.data || []
  const products = productsData?.data || []
  const topics = topicsData?.data || []
  const articlesMeta = articlesData?.meta

  const clearInput = () => setQuery('')
  const handleSelectTopic = (topic: TopicEntity) => {
    if (selectedProduct) setSelectedProduct(undefined)
    clearInput()
    setSelectedTopic((current) => (current?.id === topic.id ? undefined : topic))
  }
  const handleSelectProduct = (product: ProductEntity) => {
    if (selectedTopic) setSelectedTopic(undefined)
    clearInput()
    setSelectedProduct((current) => (current?.id === product.id ? undefined : product))
  }

  const articlesAmount = articlesMeta?.pagination?.total ?? 0
  const headerTitle = useMemo(() => {
    let title: Maybe<string> | undefined = 'Latest releases'
    if (router.isReady) {
      if (selectedDifficulty) title = selectedDifficulty.attributes?.shortDescription
      if (searchQuery || selectedTopic || selectedProduct) title = 'Search results'
    }
    return title
  }, [router.isReady, searchQuery, selectedDifficulty, selectedProduct, selectedTopic])

  return (
    <>
      <SearchInput isTopOfPage className="w-full sm:hidden" handleSearch={setQuery} />
      <ArticlesPageHeader
        title={headerTitle}
        difficulties={difficulties}
        selectedDifficulty={selectedDifficultyIndex}
        onSelect={setSelectedDifficultyIndex}
      />
      <Container maxWidth="6xl" className={classNames('mx-auto pb-10', DEFAULT_SIDE_PADDING)}>
        <div className="grid grid-cols-2 w-full gap-3 sm:hidden mt-[22px]">
          <Select value={selectedDifficultyIndex} onValueChange={setSelectedDifficultyIndex}>
            <SelectTrigger placeholder="Select Difficulty">{selectedDifficulty?.attributes?.name}</SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty, i) => (
                <SelectItem key={difficulty.id} value={`${i}`}>
                  {difficulty.attributes?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortByIndex} onValueChange={setSortByIndex}>
            <SelectTrigger placeholder="Sort by">{SORTING_OPTIONS[+sortByIndex].name}</SelectTrigger>
            <SelectContent>
              {SORTING_OPTIONS?.map((option, i) => (
                <SelectItem key={option.key} value={`${i}`}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
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
            <div className="flex flex-col gap-2 mt-12">
              {products.map((product, i) => (
                <span
                  key={product.id}
                  className={classNames(
                    'py-2 px-5 rounded-lg hover:bg-blue-500 text-slate-300',
                    selectedProduct?.id === product.id && 'bg-blue-500'
                  )}
                  onClick={() => handleSelectProduct(product)}
                  onKeyUp={() => handleSelectProduct(product)}
                >
                  {product.attributes?.longName}
                </span>
              ))}
              {topics.map((topic, i) => (
                <span
                  key={topic.id}
                  className={classNames(
                    'py-2 px-5 rounded-lg hover:bg-blue-500 text-slate-300',
                    selectedTopic?.id === topic.id && 'bg-blue-500'
                  )}
                  onClick={() => handleSelectTopic(topic)}
                  onKeyUp={() => handleSelectTopic(topic)}
                >
                  {topic.attributes?.name}
                </span>
              ))}
            </div>
          </aside>

          <div className="w-full">
            {articles && !articles.length ? (
              <span className="text-lg">No articles found</span>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{articlesAmount} Results</span>
                  <Select value={sortByIndex} onValueChange={setSortByIndex}>
                    <SelectTrigger placeholder="Sort by">{SORTING_OPTIONS[+sortByIndex].name}</SelectTrigger>
                    <SelectContent>
                      {SORTING_OPTIONS?.map((option, i) => (
                        <SelectItem key={option.key} value={`${i}`}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] sm:mt-12 mt-[22px]">
                  <ArticleList
                    articles={articles}
                    loading={loading || !articles}
                    render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
                  />
                </div>
              </>
            )}
            <div className="flex justify-center mt-12">
              {articlesMeta?.pagination?.pageCount && articlesMeta?.pagination?.pageCount > 0 && (
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
