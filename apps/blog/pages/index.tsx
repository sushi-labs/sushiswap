import { SearchIcon } from '@heroicons/react/outline'
import { useDebounce } from '@sushiswap/hooks'
import { LinkInternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Article, getArticles } from 'lib/strapi/article'
import { Category, getCategories } from 'lib/strapi/categories'
import type { InferGetServerSidePropsType } from 'next'
import type { FC } from 'react'
import { useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { ArticleList, Card, Categories, Hero } from '../components'
import BlogSeo from '../components/seo/blog-seo'

export async function getStaticProps() {
  const [articles, categories] = await Promise.all([
    getArticles({ pagination: { start: 0, limit: 15 } }),
    getCategories(),
  ])

  return {
    props: {
      fallback: {
        '/articles': articles || [],
        '/categories': categories || [],
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
  const { data: articles } = useSWR<Article[]>('/articles')
  const { data: categories } = useSWR<Category[]>('/categories')

  const { data: filterData, isValidating } = useSWR(
    ['/articles', selected, debouncedQuery],
    async ([_url, _selected, _debouncedQuery]) => {
      return getArticles({
        filters: {
          ...(debouncedQuery && { title: { $containsi: _debouncedQuery } }),
          ...(selected.length > 0 && {
            categories: {
              id: {
                $in: _selected,
              },
            },
          }),
        },
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
  const articleList =
    selected && filterData ? filterData : articles ? articles : undefined

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
                    categories={categories || ([] as Category[])}
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
                  articles={articleList}
                  loading={loading}
                  render={(article) => (
                    <Card
                      article={article}
                      key={`article__left__${article.slug}`}
                    />
                  )}
                />
              </div>
            ) : null}
            <div className="flex justify-center">
              <Button asChild variant="secondary">
                <LinkInternal href="/archive">View Archive</LinkInternal>
              </Button>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
