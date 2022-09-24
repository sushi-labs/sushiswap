import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@sushiswap/hooks'
import { Button, CheckIcon, CircleIcon, classNames, Container, Typography } from '@sushiswap/ui'
import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { DifficultyCard } from 'common/components/DifficultyCard'
import { AcademySeo } from 'common/components/Seo/AcademySeo'
import { AdvancedUserIcon, BeginnerUserIcon, TechnicalUserIcon } from 'common/icons'
import { InferGetServerSidePropsType } from 'next'
import { FC, useRef, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, ArticleEntityResponseCollection, CategoryEntityResponseCollection, Global } from '../.mesh'
import { ArticleList, Card, Categories, Hero, SearchInput } from '../common/components'
import { getArticles, getCategories, getDifficulties } from '../lib/api'

export const defaultSidePadding = 'px-6 sm:px-4'
export const difficultyColors = ['#7CFF6B', '#FFD166', '#F338C3']

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
  // const appHeaderHeight = 54
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>()
  // const [isSticky, setIsSticky] = useState(false)
  // const { isSm } = useBreakpoint('sm')
  // const isMobileStickySearchBar = !isSm && isSticky
  const heroRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const cachedRef = heroRef.current
  //   if (cachedRef) {
  //     const observer = new IntersectionObserver(([e]) => setIsSticky(!e.isIntersecting), {
  //       threshold: appHeaderHeight / cachedRef.clientHeight,
  //     })
  //     observer.observe(cachedRef)

  //     return () => {
  //       observer.unobserve(cachedRef)
  //     }
  //   }
  // }, [])

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
  const difficulties = difficultiesData?.data || []
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
            <Button
              color="gray"
              className="h-8 font-normal !bg-slate-800 rounded-full pr-1 sm:hidden"
              endIcon={<PlusCircleIcon fill="#3B7EF6" height={24} width={24} />}
            >
              View All
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-9 sm:mt-8">
            <Categories selected={selectedCategory} onSelect={handleSelectCategory} categories={categories || []} />
          </div>

          <div className="items-center gap-8 mt-[42px] sm:flex hidden">
            <Typography variant="xl" weight={700}>
              Difficulty:
            </Typography>
            <div className="flex flex-wrap gap-6">
              {difficulties.map(({ id, attributes }, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectDifficulty(id)}
                  className={classNames(
                    'text-sm pl-3 pr-4 font-bold h-[38px] rounded-lg border flex items-center gap-2'
                  )}
                  style={{ borderColor: difficultyColors[i] }}
                >
                  <span className="w-[18px] h-[18px] flex items-center justify-center">
                    {selectedDifficulty === id ? (
                      <CheckIcon stroke={difficultyColors[i]} width={18} height={18} />
                    ) : (
                      <CircleIcon fill={difficultyColors[i]} stroke={difficultyColors[i]} width={8} height={8} />
                    )}
                  </span>
                  {attributes.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={classNames('mt-9 sm:mt-[70px]', defaultSidePadding)}>
          {articleList && (
            <div className="grid grid-cols-1 gap-6 transition-all sm:grid-cols-2 md:grid-cols-3">
              <ArticleList
                articles={articleList as ArticleEntity[]}
                loading={loading}
                render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
              />
            </div>
          )}

          <div className="flex justify-center mt-14">
            <Button
              as="a"
              href={'/academy/articles' + (queryParams ? `?${queryParams}` : '')}
              color="gray"
              variant="outlined"
              size="md"
              className="rounded-full"
            >
              View All
              <PlusCircleIcon width={20} height={20} />
            </Button>
          </div>
        </div>
      </Container>

      <AdditionalArticles title="Latest Releases">
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
