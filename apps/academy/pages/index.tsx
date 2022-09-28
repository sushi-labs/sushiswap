import { useDebounce } from '@sushiswap/hooks'
import { CircleIcon, classNames, Container, Typography } from '@sushiswap/ui'
import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { DifficultyCard } from 'common/components/DifficultyCard'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { AdvancedUserIcon, BeginnerUserIcon, TechnicalUserIcon } from 'common/icons'
import { InferGetServerSidePropsType } from 'next'
import { FC, useRef, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, ArticleEntityResponseCollection, CategoryEntityResponseCollection, Global } from '../.mesh'
import { ArticleList, Card, Categories, Hero, HomeBackground, SearchInput, ViewAllButton } from '../common/components'
import { getArticles, getCategories, getDifficulties } from '../lib/api'

export const defaultSidePadding = 'px-6 sm:px-4'
export const difficultyColors = ['#7CFF6B', '#EEB531', '#F338C3']

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
  const queryParams = new URLSearchParams({
    ...(selectedDifficulty && { difficulty: selectedDifficulty }),
    ...(selectedCategory && { category: selectedCategory }),
  }).toString()

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

  return (
    <>
      <AcademySeo seo={seo} />
      <HomeBackground />
      <Container maxWidth="6xl" className="flex flex-col pb-16 mx-auto sm:pb-24">
        <div ref={heroRef}>
          <Hero />
        </div>
        <SearchInput ref={heroRef} />

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
          />
        </div>

        <div className={classNames('flex flex-col mt-[46px] sm:mt-[124px]', defaultSidePadding)}>
          <div className="flex justify-between">
            <span className="text-xl font-bold sm:text-2xl">Choose Topic</span>
            {/** TODO: implement */}
            <ViewAllButton onClick={() => null} isSmall />
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-9 sm:mt-8">
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
            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))]">
              <ArticleList
                articles={articleList as ArticleEntity[]}
                loading={loading}
                render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
              />
            </div>
          )}

          <div className="justify-center hidden sm:flex mt-14">
            <ViewAllButton as="a" href={'/academy/articles' + (queryParams ? `?${queryParams}` : '')} />
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
