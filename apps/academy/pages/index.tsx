import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Container, Select, Typography } from '@sushiswap/ui'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { defaultSidePadding } from 'common/helpers'
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
  TopicEntity,
  TopicEntityResponseCollection,
} from '../.mesh'
import {
  AdditionalArticles,
  ArticleList,
  Card,
  Difficulties,
  DifficultyCard,
  GradientWrapper,
  Hero,
  HomeBackground,
  SearchInput,
  Topics,
  ViewAllButton,
} from '../common/components'
import { getArticles, getDifficulties, getTopics } from '../lib/api'

export async function getStaticProps() {
  const articles = await getArticles({ pagination: { limit: 6 } })
  const difficulties = await getDifficulties()
  const topics = await getTopics()

  return {
    props: {
      fallback: {
        ['/articles']: articles?.articles,
        ['/difficulties']: difficulties?.difficulties,
        ['/topics']: topics?.topics,
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
  const [selectedTopic, setSelectedTopic] = useState<TopicEntity>()
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: articlesData } = useSWR<ArticleEntityResponseCollection>('/articles')
  const { data: difficultiesData } = useSWR<DifficultyEntityResponseCollection>('/difficulties')
  const { data: topicsData } = useSWR<TopicEntityResponseCollection>('/topics')
  const { data: filterData, isValidating } = useSWR(
    [`/articles`, selectedTopic, selectedDifficulty],
    async (_url, searchTopic, searchDifficulty) => {
      const difficultySlug = searchDifficulty?.attributes?.slug
      const topicSlug = searchTopic?.attributes?.slug
      const difficultyFilter = { difficulty: { slug: { eq: difficultySlug } } }
      const topicsFilter = { topics: { slug: { eq: topicSlug } } }

      return (
        await getArticles({
          pagination: { limit: 6 },
          filters: {
            ...(searchTopic && topicsFilter),
            ...(difficultySlug && difficultyFilter),
          },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: false }
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const difficulties = difficultiesData?.data || []
  const topics = topicsData?.data || []

  const articleList = useMemo(() => {
    if (filterData?.data && (selectedTopic || selectedDifficulty)) return filterData.data
    return articles
  }, [articles, filterData?.data, selectedDifficulty, selectedTopic])
  const latestReleases = articles?.slice(0, 3)

  /**
   * const initialArticleList = special tag
   */

  const handleSelectDifficulty = (difficulty: DifficultyEntity) => {
    setSelectedDifficulty((current) => (current?.id === difficulty.id ? undefined : difficulty))
  }
  const handleSelectTopic = (topic: TopicEntity) => {
    setSelectedTopic((current) => (current?.id === topic.id ? undefined : topic))
  }
  const handleSearch = (value: string) => {
    router.push({
      pathname: '/articles',
      query: { search: value },
    })
  }

  return (
    <>
      <AcademySeo seo={seo} />
      <HomeBackground />
      <Container maxWidth="6xl" className="flex flex-col pb-16 mx-auto sm:pb-24">
        <div ref={heroRef}>
          <Hero />
        </div>
        <SearchInput handleSearch={handleSearch} ref={heroRef} />

        <div
          className={classNames(
            'overflow-x-auto pb-10 gap-5 pt-6 sm:pt-10 sm:gap-6 grid grid-cols-[repeat(3,minmax(306px,1fr))]',
            defaultSidePadding,
            'hide-scrollbar'
          )}
        >
          {difficulties.map((difficulty, i) => (
            <DifficultyCard key={i} difficulty={difficulty} />
          ))}
        </div>

        <div className={classNames('z-[1] flex flex-col mt-[46px] sm:mt-[124px]', defaultSidePadding)}>
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
                  value={selectedTopic}
                  onChange={setSelectedTopic}
                  button={
                    <Listbox.Button
                      type="button"
                      className="flex items-center justify-between w-full px-4 border rounded-lg bg-slate-800 text-slate-50 h-9 border-slate-700"
                    >
                      <Typography variant="xs" weight={500}>
                        {selectedTopic?.attributes?.name ?? 'All Topics'}
                      </Typography>
                      <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                    </Listbox.Button>
                  }
                >
                  <Select.Options className="!bg-slate-700 p-2 !max-h-[unset] space-y-1">
                    {topics.map((topic, i) => (
                      <Listbox.Option
                        key={i}
                        value={topic}
                        className="p-2 text-xs rounded-lg cursor-pointer hover:bg-blue-500 transform-all"
                      >
                        {topic.attributes?.name}
                      </Listbox.Option>
                    ))}
                  </Select.Options>
                </Select>
                <Select
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
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
                    {difficulties.map((difficulty, i) => (
                      <Listbox.Option
                        key={i}
                        value={difficulty}
                        className="p-2 text-xs rounded-lg cursor-pointer hover:bg-blue-500 transform-all"
                      >
                        {difficulty.attributes?.name}
                      </Listbox.Option>
                    ))}
                  </Select.Options>
                </Select>
              </Disclosure.Panel>
            </Transition>
          </Disclosure>

          <div className="flex-wrap hidden gap-3 sm:flex sm:gap-4 mt-9 sm:mt-8">
            <Topics selected={selectedTopic} onSelect={handleSelectTopic} topics={topics || []} />
          </div>

          <div className="items-center hidden gap-8 mt-10 sm:flex">
            <Typography variant="xl" weight={700}>
              Difficulty:
            </Typography>
            <div className="flex flex-wrap gap-6">
              <Difficulties
                selected={selectedDifficulty}
                onSelect={handleSelectDifficulty}
                difficulties={difficulties}
              />
            </div>
          </div>
        </div>

        <div className={classNames('mt-9 sm:mt-[70px]', defaultSidePadding)}>
          {articleList && (
            <div className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))]">
              <ArticleList
                articles={articleList as ArticleEntity[]}
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
                  ...(selectedDifficulty && { difficulty: selectedDifficulty.attributes?.slug }),
                  ...(selectedTopic && { topic: selectedTopic.attributes?.slug }),
                },
              }}
            >
              <ViewAllButton />
            </Link>
          </div>
        </div>
      </Container>

      <AdditionalArticles title="Latest Releases" className="pb-6">
        {latestReleases && (
          <ArticleList
            articles={latestReleases as ArticleEntity[]}
            loading={loading}
            render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
            skeletonAmount={latestReleases.length}
          />
        )}
      </AdditionalArticles>
    </>
  )
}

export default Home
