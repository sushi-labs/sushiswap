import { PlusCircleIcon } from '@heroicons/react/solid'
import { useDebounce } from '@sushiswap/hooks'
import { Button, classNames, Container, Tab, Typography } from '@sushiswap/ui'
import { LevelCard } from 'components/LevelCard'
import { BlogSeo } from 'components/Seo/BlogSeo'
import { InferGetServerSidePropsType } from 'next'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { ArticleEntity, ArticleEntityResponseCollection, CategoryEntityResponseCollection, Global } from '../.mesh'
import { ArticleList, Card, Categories, Hero } from '../components'
import { getArticles, getCategories, getLevels } from '../lib/api'

export const defaultSidePadding = 'px-6 sm:px-4'

export async function getStaticProps() {
  const articles = await getArticles({ pagination: { limit: 5 } })
  const categories = await getCategories()
  const levels = await getLevels()

  return {
    props: {
      fallback: {
        ['/articles']: articles?.articles,
        ['/categories']: categories?.categories,
        ['/levels']: levels?.categories,
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
  const [selectedLevel, setSelectedLevel] = useState<string>()
  const queryParams = new URLSearchParams({
    ...(selectedLevel && { level: selectedLevel }),
    ...(selectedCategory && { category: selectedCategory }),
  }).toString()

  const { data: articlesData } = useSWR<ArticleEntityResponseCollection>('/articles')
  const { data: categoriesData } = useSWR<CategoryEntityResponseCollection>('/categories')
  const { data: levelsData } = useSWR<CategoryEntityResponseCollection>('/levels')
  const { data: filterData, isValidating } = useSWR(
    [`/articles`, selectedCategory, selectedLevel],
    async (_url, categoryFilter, levelFilter) => {
      return (
        await getArticles({
          pagination: { limit: 5 },
          filters: {
            ...((categoryFilter || levelFilter) && {
              categories: {
                id: {
                  in: [categoryFilter, levelFilter].filter(Boolean),
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
  const levels = levelsData?.data || []
  const articleList =
    (selectedCategory || selectedLevel) && filterData?.data ? filterData?.data : articles ? articles : undefined
  const latestReleases = articles?.slice(0, 3)

  /**
   * const initialArticleList = special tag
   */

  const handleSelectLevel = (id: string) => setSelectedLevel((currentLevel) => (currentLevel === id ? undefined : id))
  const handleSelectCategory = (id: string) =>
    setSelectedCategory((currentCategory) => (currentCategory === id ? undefined : id))

  return (
    <>
      <BlogSeo seo={seo} />
      <div className="flex flex-col">
        <Hero />
        <section className="pt-40 pb-24">
          <Container maxWidth="6xl" className={classNames('flex flex-col gap-24 mx-auto', defaultSidePadding)}>
            <div className="sticky z-10 overflow-x-auto top-[54px] md:hidden">
              <Tab.Group className="p-1 rounded-full bg-slate-500 h-[34px] min-w-max border-0">
                <Tab.List>
                  {levels.map(({ id, attributes }) => (
                    <Tab className="h-auto rounded-full min-w-max" key={id} onClick={() => handleSelectLevel(id)}>
                      <Typography variant="xs" weight={500}>
                        {attributes.description}
                      </Typography>
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>
            <div className="flex min-w-full gap-6 -mt-20 overflow-x-auto md:mt-0">
              <LevelCard
                name="Beginner"
                title="Getting started with Sushi: Tutorials & Product Explainers"
                chipLabel="For Beginner users"
                imgSrc=""
              />
              <LevelCard
                name="Advanced"
                title="Deepdive into Sushi: Strategies & Product Features"
                chipLabel="For Advanced users"
                imgSrc=""
              />
              <LevelCard
                name="Builders"
                title="Building on Sushi: Technical Documentation"
                chipLabel="For Builders"
                imgSrc=""
              />
            </div>

            <div>
              <div className="flex flex-col">
                <Typography variant="h3" weight={700}>
                  Choose Topic:
                </Typography>
                <div className="flex flex-wrap gap-8 mt-8">
                  <Categories
                    selected={selectedCategory}
                    onSelect={handleSelectCategory}
                    categories={categories || []}
                  />
                </div>
                <div className="items-baseline hidden gap-8 mt-16 md:flex">
                  <Typography variant="h3" weight={700}>
                    Difficulty:
                  </Typography>
                  <div className="flex flex-wrap gap-6">
                    {levels.map(({ id, attributes }) => (
                      <Button
                        size="sm"
                        color={selectedLevel === id ? 'blue' : 'gray'}
                        onClick={() => handleSelectLevel(id)}
                        variant="outlined"
                        key={attributes.name}
                        className="!text-xs rounded-lg"
                      >
                        {attributes.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {articleList && (
                <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3">
                  <ArticleList
                    articles={articleList as ArticleEntity[]}
                    loading={loading}
                    render={(article, i) => (
                      <Card article={article} isBig={!i} key={`article__left__${article?.attributes?.slug}`} />
                    )}
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

            <div>
              <Typography variant="h3" weight={700}>
                Latest Releases
              </Typography>
              {latestReleases && (
                <div className="grid grid-cols-1 gap-4 mt-12 transition-all sm:grid-cols-2 md:grid-cols-3">
                  <ArticleList
                    articles={latestReleases as ArticleEntity[]}
                    loading={loading}
                    render={(article) => <Card article={article} key={`article__left__${article?.attributes?.slug}`} />}
                    skeletonAmount={latestReleases.length}
                  />
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
