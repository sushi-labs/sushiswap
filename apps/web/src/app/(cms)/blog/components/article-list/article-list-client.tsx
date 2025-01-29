'use client'

import {
  type BlogArticle,
  type BlogArticleMeta,
  getBlogArticles,
} from '@sushiswap/graph-client/strapi'
import { Loader } from '@sushiswap/ui'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ArticleCard } from '../article-card/article-card'
import { ArticleCardLoading } from '../article-card/article-card-loading'
import { useBlogSearch } from '../blog-search-provider'

interface ArticleListClient {
  initialArticles: BlogArticle[]
  initialMeta: BlogArticleMeta
}

function Shell({ children }: { children: React.ReactNode[] }) {
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">{children}</div>
  )
}

export function ArticleListClient({
  initialArticles,
  initialMeta,
}: ArticleListClient) {
  const { search, categories } = useBlogSearch()

  const isEmptySearch = !(search || categories)
  const pageSize = initialArticles.length

  const initialData = useMemo(() => {
    return {
      pageParams: [0],
      pages: [{ articles: initialArticles, meta: initialMeta }],
    }
  }, [initialArticles, initialMeta])

  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.setQueryData(['blog-articles-infinite', {}], initialData)
  }, [queryClient, initialData])

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ['blog-articles-infinite', { search, categories }],
    queryFn: async ({ pageParam }) => {
      const { articles, meta } = await getBlogArticles({
        pagination: { start: pageParam, limit: pageSize },
        filters: {
          title: {
            containsi: search,
          },
          categories: {
            slug: {
              in: categories,
            },
          },
        },
      })

      return { articles, meta }
    },
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pageSize * pages.length,
    staleTime: 3600,
    gcTime: 3600,
    initialData: isEmptySearch ? initialData : undefined,
  })

  const articles = useMemo(() => {
    if (!data) {
      return undefined
    }

    return data.pages.flat().flatMap((page) => page.articles)
  }, [data])

  const meta = data?.pages[0]?.meta

  if (isLoading) {
    return (
      <Shell>
        {Array.from({ length: pageSize }).map((_, index) => (
          <ArticleCardLoading key={index} />
        ))}
      </Shell>
    )
  }

  if (!articles || isError) {
    return <div>An error has occurred</div>
  }

  if (!articles.length) {
    return <div>No articles found</div>
  }

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchNextPage}
      hasMore={articles.length < (meta?.total || Number.NEGATIVE_INFINITY)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
      className="!overflow-visible"
    >
      <Shell>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </Shell>
    </InfiniteScroll>
  )
}
