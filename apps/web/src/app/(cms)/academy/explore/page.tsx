import { getAcademyArticles } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import { DEFAULT_SIDE_PADDING } from '../../constants'
import { AcademySearchProvider } from '../components/academy-search-provider'
import { ArticleListFiltered } from '../components/article-list/article-list-filtered'
import { ExplorePageHeader } from './components/explore-page-header'
import { ResultCount } from './components/result-count'
import { SearchFilter } from './components/search-filter'
import { SortByDropdown } from './components/sort-by-dropdown'
import { TopicProductSidebar } from './components/topic-product-sidebar/topic-product-sidebar'

export default async function Page() {
  const { articles, meta } = await getAcademyArticles({
    pagination: {
      limit: 10,
    },
  })

  return (
    <AcademySearchProvider>
      <div className="flex flex-col animate-slide">
        <ExplorePageHeader />
        <Container
          maxWidth="6xl"
          className={classNames(
            DEFAULT_SIDE_PADDING,
            'grid md:grid-cols-7 grid-cols-1 h-full gap-6 md:gap-12 mx-auto sm:pt-12 pt-6 pb-16 relative',
          )}
        >
          <div className="md:col-span-2">
            <div className="md:space-y-12 space-y-6 sticky top-[88px]">
              <SearchFilter />
              <TopicProductSidebar />
            </div>
          </div>
          <div className="md:space-y-12 space-y-6 w-full md:col-span-5 top-[104px]">
            <div className="flex flex-row items-center justify-between gap-4">
              <ResultCount />
              <SortByDropdown />
            </div>
            <ArticleListFiltered
              initialArticles={articles}
              initialMeta={meta}
              className="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(286px,1fr))] w-full"
              infinite
            />
          </div>
        </Container>
      </div>
    </AcademySearchProvider>
  )
}
