import { useDebounce } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo, useRef, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { Article } from 'types'

import {
  DifficultyEntity,
  DifficultyEntityResponseCollection,
  Global,
  ProductEntity,
  ProductEntityResponseCollection,
  TopicEntity,
  TopicEntityResponseCollection,
} from '../.mesh'
import {
  AdditionalArticles,
  ArticleList,
  Card,
  Difficulties,
  DifficultyCard,
  FilterButton,
  Hero,
  HomeBackground,
  SearchInput,
  ViewAllButton,
} from '../common/components'
import {
  getArticles,
  getDifficulties,
  getProducts,
  getTopics,
} from '../lib/api'

export async function getStaticProps() {
  const [articles, difficulties, topics, products] = await Promise.all([
    getArticles({ pagination: { limit: 6 } }),
    getDifficulties(),
    getTopics(),
    getProducts(),
  ])

  return {
    props: {
      fallback: {
        '/articles': articles,
        '/difficulties': difficulties?.difficulties,
        '/topics': topics?.topics,
        '/products': products?.products,
      },
    },
    revalidate: 1,
  }
}

const Home: FC<
  InferGetServerSidePropsType<typeof getStaticProps> & { seo: Global }
> = ({ fallback, seo }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Home seo={seo} />
    </SWRConfig>
  )
}

const _Home: FC<{ seo: Global }> = ({ seo }) => {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyEntity>()
  const [selectedProduct, setSelectedProduct] = useState<ProductEntity>()
  const [selectedTopic, setSelectedTopic] = useState<TopicEntity>()
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: articlesData } =
    useSWR<Awaited<ReturnType<typeof getArticles>>>('/articles')
  const { data: difficultiesData } =
    useSWR<DifficultyEntityResponseCollection>('/difficulties')
  const { data: productsData } =
    useSWR<ProductEntityResponseCollection>('/products')
  const { data: topicsData } = useSWR<TopicEntityResponseCollection>('/topics')
  const { data: filterData, isValidating } = useSWR(
    ['/articles', selectedTopic, selectedDifficulty, selectedProduct],
    async ([_url, searchTopic, searchDifficulty, searchProduct]) => {
      const filters = {
        ...(searchDifficulty?.id && {
          difficulty: { id: { eq: searchDifficulty?.id } },
        }),
        ...(searchProduct?.id && {
          products: { id: { eq: searchProduct?.id } },
        }),
        ...(searchTopic?.id && { topics: { id: { eq: searchTopic?.id } } }),
      }

      return await getArticles({
        filters,
        pagination: { limit: 6 },
      })
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const difficulties = difficultiesData?.data || []
  const topics = topicsData?.data || []
  const products = productsData?.data || []

  const articleList: Article[] | undefined = useMemo(() => {
    if (
      filterData?.data &&
      (selectedTopic || selectedDifficulty || selectedProduct)
    )
      return filterData?.data
    return articles
  }, [
    articles,
    filterData?.data,
    selectedDifficulty,
    selectedTopic,
    selectedProduct,
  ])

  const latestReleases = articles?.slice(0, 3)

  /**
   * const initialArticleList = special tag
   */

  const handleSelectDifficulty = (difficulty: DifficultyEntity) => {
    setSelectedDifficulty((current) =>
      current?.id === difficulty.id ? undefined : difficulty,
    )
  }
  const handleSelectTopic = (topic: TopicEntity & { isProduct?: boolean }) => {
    if (selectedProduct) setSelectedProduct(undefined)
    setSelectedTopic((current) =>
      current?.id === topic.id ? undefined : topic,
    )
  }
  const handleSelectProduct = (
    product: ProductEntity & { isProduct?: boolean },
  ) => {
    if (selectedTopic) setSelectedTopic(undefined)
    setSelectedProduct((current) =>
      current?.id === product.id ? undefined : product,
    )
  }
  const handleSearch = (value: string) => {
    router.push({
      pathname: '/articles',
      query: { search: value },
    })
  }

  return (
    <div className="relative">
      <AcademySeo seo={seo} />
      <HomeBackground />
      <Container
        maxWidth="6xl"
        className="flex flex-col pb-16 mx-auto sm:pb-24"
      >
        <div ref={heroRef}>
          <Hero />
        </div>
        <SearchInput handleSearch={handleSearch} ref={heroRef} showTopics />

        <div
          className={classNames(
            'overflow-x-auto gap-5 pb-1 pt-[60px] sm:pt-32 sm:gap-6 grid grid-cols-[repeat(3,minmax(306px,1fr))] scroll',
            DEFAULT_SIDE_PADDING,
          )}
        >
          {difficulties.map((difficulty) => (
            <DifficultyCard key={difficulty.id} difficulty={difficulty} />
          ))}
        </div>

        <div
          className={classNames(
            'z-[1] flex flex-col mt-16 sm:mt-[124px]',
            DEFAULT_SIDE_PADDING,
          )}
        >
          <div className="flex-wrap gap-3 flex sm:gap-4 mt-9 sm:mt-8">
            {products.map(
              (product) =>
                product && (
                  <FilterButton
                    key={`product_${product.id}`}
                    isSelected={selectedProduct?.id === product.id}
                    title={product.attributes?.name}
                    onClick={() => handleSelectProduct(product)}
                  />
                ),
            )}
            {topics.map(
              (topic) =>
                topic && (
                  <FilterButton
                    key={`topic_${topic.id}`}
                    isSelected={selectedTopic?.id === topic.id}
                    title={topic.attributes?.name}
                    onClick={() => handleSelectTopic(topic)}
                  />
                ),
            )}
          </div>

          <div className="items-center gap-8 mt-10 flex flex-wrap">
            <span className="text-xl font-semibold">Difficulty:</span>
            <div className="flex flex-wrap gap-6">
              <Difficulties
                selected={selectedDifficulty as DifficultyEntity}
                onSelect={handleSelectDifficulty}
                difficulties={difficulties}
              />
            </div>
          </div>
        </div>

        <div className={classNames('mt-9 sm:mt-[70px]', DEFAULT_SIDE_PADDING)}>
          {articleList && (
            <div className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))]">
              <ArticleList
                articles={articleList}
                loading={loading}
                render={(article) => (
                  <Card
                    article={article}
                    key={`article__left__${article?.attributes?.slug}`}
                  />
                )}
              />
            </div>
          )}

          <div className="justify-center hidden mt-10 sm:flex">
            <Link
              href={{
                pathname: '/articles',
                query: {
                  ...(selectedDifficulty && {
                    difficulty: selectedDifficulty.attributes?.slug,
                  }),
                  ...(selectedProduct && {
                    product: selectedProduct.attributes?.slug,
                  }),
                  ...(selectedTopic && {
                    topic: selectedTopic.attributes?.slug,
                  }),
                },
              }}
              legacyBehavior
            >
              <ViewAllButton />
            </Link>
          </div>
        </div>
      </Container>

      <AdditionalArticles title="Latest Releases" className="pb-[70px]">
        {latestReleases && (
          <ArticleList
            articles={latestReleases}
            loading={loading}
            render={(article) => (
              <Card
                article={article}
                key={`article__left__${article?.attributes?.slug}`}
              />
            )}
            skeletonAmount={latestReleases.length}
          />
        )}
      </AdditionalArticles>
    </div>
  )
}

export default Home
