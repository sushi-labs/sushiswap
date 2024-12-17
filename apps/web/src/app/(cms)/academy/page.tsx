import NextImage from 'next/legacy/image'

import { getAcademyArticles } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import { DEFAULT_SIDE_PADDING } from '../constants'
import background from './assets/background.png'
import { ArticleList } from './components/article-list/article-list'
import { ArticleListFiltered } from './components/article-list/article-list-filtered'
import { DifficultyCardBar } from './components/difficulty-card-bar'
import { DifficultyFilterBar } from './components/difficulty-filter-bar/difficulty-filter-bar'
import { Hero } from './components/hero'
import { SearchBox } from './components/search-box'
import { TopicProductBar } from './components/topic-product-bar/topic-product-bar'
import { ViewMoreButton } from './components/view-more-button'

export const revalidate = 300

export default async function Page() {
  const { articles, meta } = await getAcademyArticles({
    pagination: { limit: 6 },
  })

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <NextImage
          className="-z-[1]"
          layout="responsive"
          src={background}
          alt="Academy Background"
          priority
          unoptimized
        />
      </div>
      <Container
        maxWidth="6xl"
        className={classNames(
          'pb-16 mx-auto sm:pb-32 space-y-16 md:space-y-32 sm:pt-16 pt-8',
          DEFAULT_SIDE_PADDING,
        )}
      >
        <div className="flex items-center flex-col space-y-8 sm:space-y-12">
          <Hero />
          <div className="md:w-3/4">
            <SearchBox />
          </div>
        </div>
        <DifficultyCardBar />
        <div className="space-y-16">
          <div className="space-y-12">
            <TopicProductBar />
            <DifficultyFilterBar />
          </div>
          <div className="flex w-full flex-col justify-center space-y-8 items-center">
            <ArticleListFiltered
              initialArticles={articles}
              initialMeta={meta}
              className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] w-full"
            />
            <ViewMoreButton includeFilters />
          </div>
        </div>
        <div className="flex w-full flex-col justify-center space-y-8 items-center">
          <div className="space-y-10 w-full">
            <span className="text-xl font-bold sm:text-2xl">
              Latest Releases
            </span>
            <ArticleList
              articles={articles.slice(0, 3)}
              className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] w-full"
            />
          </div>
          <ViewMoreButton />
        </div>
      </Container>

      <a href="/academy/article-list" className="hidden">
        Article List
      </a>
    </div>
  )
}
