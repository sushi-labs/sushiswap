import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { CircleIcon, classNames, Container, Select, Typography } from '@sushiswap/ui'
import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { DifficultyCard } from 'common/components/DifficultyCard'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { defaultSidePadding, difficultyColors } from 'common/helpers'
import { AdvancedUserIcon, BeginnerUserIcon, TechnicalUserIcon } from 'common/icons'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, Fragment, useRef, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, ArticleEntityResponseCollection, CategoryEntityResponseCollection, Global } from '../.mesh'
import {
  ArticleList,
  Card,
  Categories,
  GradientWrapper,
  Hero,
  HomeBackground,
  SearchInput,
  ViewAllButton,
} from '../common/components'
import { getArticles, getCategories, getDifficulties } from '../lib/api'

export async function getStaticProps() {
  const articles = await getArticles({ pagination: { limit: 6 } })
  const categories = await getCategories()
  const difficulties = await getDifficulties()

  return {
    props: {
      fallback: {
        ['/articles']: articles?.articles,
        ['/categories']: categories?.categories,
        ['/difficulties']: difficulties?.categories,
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
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>()
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: articlesData } = useSWR<ArticleEntityResponseCollection>('/articles')
  const { data: categoriesData } = useSWR<CategoryEntityResponseCollection>('/categories')
  const { data: difficultiesData } = useSWR<CategoryEntityResponseCollection>('/difficulties')
  const { data: filterData, isValidating } = useSWR(
    [`/articles`, selectedCategory, selectedDifficulty],
    async (_url, categoryFilter, difficultyFilter) => {
      return (
        await getArticles({
          pagination: { limit: 5 },
          filters: {
            ...((categoryFilter || difficultyFilter) && {
              categories: {
                id: {
                  in: [categoryFilter, difficultyFilter].filter(Boolean),
                },
              },
            }),
          },
        })
      )?.articles
    },
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false, revalidateOnMount: false }
  )

  const loading = useDebounce(isValidating, 400)
  const articles = articlesData?.data
  const categories = categoriesData?.data || []
  // const difficulties = difficultiesData?.data || [] // TODO: update
  const difficulties = [
    { id: '6', attributes: { name: 'Beginner' } },
    { id: '7', attributes: { name: 'Advanced' } },
    { id: '8', attributes: { name: 'Technical' } },
  ]
  const articleList =
    (selectedCategory || selectedDifficulty) && filterData?.data ? filterData?.data : articles ? articles : undefined
  const latestReleases = articles?.slice(0, 3)
  const [beginnerColor, advancedColor, technicalColor] = difficultyColors
  /**
   * const initialArticleList = special tag
   */

  const handleSelectDifficulty = (id: string) => setSelectedDifficulty((current) => (current === id ? undefined : id))
  const handleSelectCategory = (id: string) =>
    setSelectedCategory((currentCategory) => (currentCategory === id ? undefined : id))
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

        <div className="flex min-w-full gap-5 px-6 py-6 mt-8 overflow-x-auto sm:mt-24 sm:gap-6 sm:px-4">
          <DifficultyCard
            name="Beginner"
            icon={<BeginnerUserIcon />}
            chipLabel="For Beginners"
            title="Getting started with Sushi: Tutorials & Product Explainers"
            color={beginnerColor}
          />
          <DifficultyCard
            name="Advanced"
            icon={<AdvancedUserIcon />}
            chipLabel="For Advanced users"
            title="Deepdive into Sushi: Strategies & Product Features"
            color={advancedColor}
          />
          <DifficultyCard
            name="Builders"
            icon={<TechnicalUserIcon />}
            chipLabel="For Builders"
            title="Building on Sushi: Technical Documentation"
            color={technicalColor}
            href="https://dev.sushi.com/"
          />
        </div>

        <div className={classNames('z-[1] flex flex-col mt-[46px] sm:mt-[124px]', defaultSidePadding)}>
          <Disclosure>
            <div className="flex justify-between">
              <span className="text-xl font-bold sm:text-2xl">Choose Topic</span>
              {/** TODO: implement */}

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
              <Disclosure.Panel className="grid grid-cols-2 gap-3 mt-9">
                <Select
                  button={
                    <Listbox.Button
                      type="button"
                      className="flex items-center justify-between w-full px-4 border rounded-lg bg-slate-800 text-slate-50 h-9 border-slate-700"
                    >
                      <Typography variant="xs" weight={500}>
                        All Topics
                      </Typography>
                      <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                    </Listbox.Button>
                  }
                >
                  <Select.Options className={classNames('!bg-slate-700 p-6 gap-6 grid')}>
                    {['topic1', 'topic2', 'topic3', 'topic4'].map((option, i) => (
                      <Typography weight={500} variant="sm" key={i}>
                        {option}
                      </Typography>
                    ))}
                  </Select.Options>
                </Select>
                <Select
                  button={
                    <GradientWrapper className="w-full rounded-lg h-9">
                      <Listbox.Button
                        type="button"
                        className="flex items-center justify-between w-full h-full px-4 rounded-lg bg-slate-800 text-slate-50"
                      >
                        <Typography variant="xs" weight={500}>
                          Select Difficulty
                        </Typography>
                        <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                      </Listbox.Button>
                    </GradientWrapper>
                  }
                >
                  <Select.Options className={classNames('!bg-slate-700 p-6 gap-6 grid')}>
                    {['level1', 'level2', 'level3'].map((option, i) => (
                      <Typography weight={500} variant="sm" key={i}>
                        {option}
                      </Typography>
                    ))}
                  </Select.Options>
                </Select>
              </Disclosure.Panel>
            </Transition>
          </Disclosure>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-9 sm:mt-8">
            <Categories selected={selectedCategory} onSelect={handleSelectCategory} categories={categories || []} />
          </div>

          <div className="items-center hidden gap-8 mt-10 sm:flex">
            <Typography variant="xl" weight={700}>
              Difficulty:
            </Typography>
            <div className="flex flex-wrap gap-6">
              {difficulties.map(
                // TODO: extract to component
                ({ id, attributes }, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectDifficulty(id)}
                    className="text-sm px-4 font-semibold h-[38px] rounded-lg flex items-center gap-2.5 border"
                    style={{
                      borderColor: selectedDifficulty === id ? difficultyColors[i] : 'transparent',
                      background: `${difficultyColors[i]}33`,
                    }}
                  >
                    <CircleIcon fill={difficultyColors[i]} stroke={difficultyColors[i]} width={8} height={8} />
                    {attributes.name}
                  </button>
                )
              )}
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
                  ...(selectedDifficulty && { difficulty: selectedDifficulty }),
                  ...(selectedCategory && { category: selectedCategory }),
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
