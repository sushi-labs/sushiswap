import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Container, Select, Typography } from '@sushiswap/ui'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, Fragment, useMemo, useRef, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  ArticleEntity,
  ArticleEntityResponseCollection,
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
  GradientWrapper,
  Hero,
  HomeBackground,
  SearchInput,
  SelectOption,
  ViewAllButton,
} from '../common/components'
import { getArticles, getDifficulties, getProducts, getTopics } from '../lib/api'

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
        ['/articles']: articles?.articles,
        ['/difficulties']: difficulties?.difficulties,
        ['/topics']: topics?.topics,
        ['/products']: products?.products,
      },
    },
    revalidate: 1,
  }
}

const Home: FC<InferGetServerSidePropsType<typeof getStaticProps> & { seo: Global }> = ({ fallback, seo }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Home seo={seo} />
    </SWRConfig>
  )
}

const _Home: FC<{ seo: Global }> = ({ seo }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyEntity>()
  const [selectedProduct, setSelectedProduct] = useState<ProductEntity>()
  const [selectedTopic, setSelectedTopic] = useState<TopicEntity>()
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: articlesData } = useSWR<ArticleEntityResponseCollection>('/articles')
  const { data: difficultiesData } = useSWR<DifficultyEntityResponseCollection>('/difficulties')
  const { data: productsData } = useSWR<ProductEntityResponseCollection>('/products')
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

      return (
        await getArticles({
          filters,
          pagination: { limit: 6 },
        })
      )?.articles
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    }
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const difficulties = difficultiesData?.data || []
  const topics = topicsData?.data || []
  const products = productsData?.data || []

  const articleList: ArticleEntity[] | undefined = useMemo(() => {
    if (filterData?.data && (selectedTopic || selectedDifficulty || selectedProduct)) return filterData.data
    return articles
  }, [articles, filterData?.data, selectedDifficulty, selectedTopic, selectedProduct])
  const latestReleases = articles?.slice(0, 3)

  /**
   * const initialArticleList = special tag
   */

  const handleSelectDifficulty = (difficulty: DifficultyEntity) => {
    setSelectedDifficulty((current) => (current?.id === difficulty.id ? undefined : difficulty))
  }
  const handleSelectTopic = (topic: TopicEntity & { isProduct?: boolean }) => {
    if (selectedProduct) setSelectedProduct(undefined)
    setSelectedTopic((current) => (current?.id === topic.id ? undefined : topic))
  }
  const handleSelectProduct = (product: ProductEntity & { isProduct?: boolean }) => {
    if (selectedTopic) setSelectedTopic(undefined)
    setSelectedProduct((current) => (current?.id === product.id ? undefined : product))
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
      <Container maxWidth="6xl" className="flex flex-col pb-16 mx-auto sm:pb-24">
        <div ref={heroRef}>
          <Hero />
        </div>
        <SearchInput handleSearch={handleSearch} ref={heroRef} showTopics />

        <div
          className={classNames(
            'overflow-x-auto gap-5 pb-1 pt-[60px] sm:pt-32 sm:gap-6 grid grid-cols-[repeat(3,minmax(306px,1fr))] scroll',
            DEFAULT_SIDE_PADDING
          )}
        >
          {difficulties.map((difficulty) => (
            <DifficultyCard key={difficulty.id} difficulty={difficulty} />
          ))}
        </div>

        <div className={classNames('z-[1] flex flex-col mt-16 sm:mt-[124px]', DEFAULT_SIDE_PADDING)}>
          <Disclosure>
            <div className="flex justify-between">
              <span className="text-xl font-bold sm:text-2xl">Choose Topic</span>

              <Disclosure.Button as={Fragment}>
                <ViewAllButton isSmall />
              </Disclosure.Button>
            </div>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="grid grid-cols-2 gap-3 mt-9 sm:hidden">
                <Select
                  onChange={([value, isProduct]: [TopicEntity, false] | [ProductEntity, true]) =>
                    isProduct ? handleSelectProduct(value) : handleSelectTopic(value)
                  }
                  button={
                    <Listbox.Button
                      type="button"
                      className="flex items-center justify-between w-full px-4 border rounded-lg bg-slate-800 text-slate-50 h-9 border-slate-700"
                    >
                      <Typography variant="xs" weight={500}>
                        {selectedTopic?.attributes?.name ?? selectedProduct?.attributes?.name ?? 'All Topics'}
                      </Typography>
                      <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                    </Listbox.Button>
                  }
                >
                  <Select.Options className="!bg-slate-700 p-2 !max-h-[unset] space-y-1">
                    {products.map((product) => (
                      <SelectOption
                        className="text-xs"
                        key={`product_${product.id}`}
                        value={[product, true]}
                        title={product.attributes?.name}
                        isSelected={selectedProduct?.id === product.id}
                      />
                    ))}
                    {topics.map((topic) => (
                      <SelectOption
                        className="text-xs"
                        key={`topic_${topic.id}`}
                        value={[topic, false]}
                        title={topic.attributes?.name}
                        isSelected={selectedTopic?.id === topic.id}
                      />
                    ))}
                  </Select.Options>
                </Select>
                <Select
                  value={selectedDifficulty}
                  onChange={handleSelectDifficulty}
                  button={
                    <GradientWrapper className="w-full rounded-lg h-9">
                      <Listbox.Button
                        type="button"
                        className="flex items-center justify-between w-full h-full px-4 rounded-lg bg-slate-800 text-slate-50"
                      >
                        <Typography variant="xs" weight={500}>
                          {selectedDifficulty?.attributes?.name ?? 'Select Difficulty'}
                        </Typography>
                        <ChevronDownIcon width={12} height={12} aria-hidden="true" />
                      </Listbox.Button>
                    </GradientWrapper>
                  }
                >
                  <Select.Options className="!bg-slate-700 p-2 !max-h-[unset] space-y-1">
                    {difficulties.map((difficulty) => (
                      <SelectOption
                        className="text-xs"
                        key={`difficulty_${difficulty.id}`}
                        value={difficulty}
                        title={difficulty.attributes?.name}
                        isSelected={selectedDifficulty?.id === difficulty.id}
                      />
                    ))}
                  </Select.Options>
                </Select>
              </Disclosure.Panel>
            </Transition>
          </Disclosure>

          <div className="flex-wrap hidden gap-3 sm:flex sm:gap-4 mt-9 sm:mt-8">
            {products.map(
              (product) =>
                product && (
                  <FilterButton
                    key={`product_${product.id}`}
                    isSelected={selectedProduct?.id === product.id}
                    title={product.attributes?.name}
                    onClick={() => handleSelectProduct(product)}
                  />
                )
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
                )
            )}
          </div>

          <div className="items-center hidden gap-8 mt-10 sm:flex">
            <Typography variant="xl" weight={700}>
              Difficulty:
            </Typography>
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
                render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
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
            render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
            skeletonAmount={latestReleases.length}
          />
        )}
      </AdditionalArticles>
    </div>
  )
}

export default Home
