import { SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import type { InferGetServerSidePropsType } from 'next'
import type { FC } from 'react'
import { useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { ArticleList, Card, Categories, Hero } from '../components'
import BlogSeo from '../components/seo/blog-seo'
import { getArticles, getCategories } from '../lib/api'
import type { GhostArticle } from '../lib/ghost'
import type { Article, Category, Collection } from '../types'

export async function getStaticProps() {
  const [articles, categories] = await Promise.all([
    getArticles({ pagination: { limit: 10 } }),
    getCategories(),
  ])
  return {
    props: {
      fallback: {
        '/articles': articles.articles || [],
        '/categories': categories.categories || [],
      },
    },
    revalidate: 60,
  }
}

const Home: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({
  fallback,
}) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Home />
    </SWRConfig>
  )
}

const _Home: FC = () => {
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 200)

  const [selected, setSelected] = useState<string[]>([])
  const { data: articlesData } = useSWR<Collection<GhostArticle>>('/articles')
  const { data: categoriesData } = useSWR<Collection<Category>>('/categories')

  const { data: filterData, isValidating } = useSWR(
    ['/articles', selected, debouncedQuery],
    async ([_url, _selected, _debouncedQuery]) => {
      return (
        await getArticles({
          filters: {
            ...(debouncedQuery && { title: { containsi: _debouncedQuery } }),
            ...(selected.length > 0 && {
              categories: {
                id: {
                  in: _selected,
                },
              },
            }),
          },
        })
      ).articles
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
  const categories = categoriesData?.data
  const articleList =
    selected && filterData?.data
      ? filterData.data
      : articles
      ? articles
      : undefined

  return (
    <>
      <BlogSeo />
      <div className="flex flex-col divide-y divide-slate-800">
        {articles?.[0] ? <Hero article={articles[0]} /> : null}
        <section className="py-10 pb-60">
          <Container className="px-4 mx-auto space-y-10" maxWidth="5xl">
            <div className="flex flex-col items-center justify-between gap-y-8 md:flex-row">
              <div className="order-2 w-full p-1 -ml-1 overflow-hidden md:order-1">
                <div className="flex flex-wrap gap-3">
                  <Categories
                    categories={categories || []}
                    onSelect={setSelected}
                    selected={selected}
                  />
                </div>
              </div>
              <div className="flex items-center order-1 w-full gap-3 px-3 md:w-auto md:order-2 rounded-xl bg-slate-800 focus-within:ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                <SearchIcon className="text-slate-500" height={24} width={24} />
                <input
                  className="w-full font-medium placeholder:text-sm h-[40px] text-slate-300 bg-transparent text-base !ring-0 !outline-0"
                  onChange={(e) => {
                    setQuery(e.target.value)
                  }}
                  placeholder="Search Article"
                />
              </div>
            </div>

            {articleList ? (
              <div className="grid grid-cols-1 gap-4 transition-all sm:grid-cols-2 md:grid-cols-3">
                <ArticleList
                  articles={articleList as Article[]}
                  loading={loading}
                  render={(article) => (
                    <Card
                      article={article}
                      key={`article__left__${article.attributes.slug}`}
                    />
                  )}
                />
              </div>
            ) : null}
            <div className="flex justify-center">
              <Button asChild variant="secondary">
                <LinkInternal href="/blog/archive">View Archive</LinkInternal>
              </Button>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
