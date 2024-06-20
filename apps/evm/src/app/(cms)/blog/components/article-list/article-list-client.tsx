'use client'

import {
  BlogArticle,
  BlogArticleMeta,
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
  meta: BlogArticleMeta
}

function Shell({ children }: { children: React.ReactNode[] }) {
  return <div className="grid grid-cols-3 gap-8">{children}</div>
}

export function ArticleListClient({
  initialArticles,
  meta,
}: ArticleListClient) {
  const { search, categories } = useBlogSearch()

  const isEmptySearch = !(search || categories)
  const pageSize = initialArticles.length

  const initialData = useMemo(() => {
    return {
      pageParams: [0],
      pages: [initialArticles],
    }
  }, [initialArticles])

  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.setQueryData(['blog-articles-infinite', {}], initialData)
  }, [queryClient, initialData])

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ['blog-articles-infinite', { search, categories }],
    queryFn: async ({ pageParam }) => {
      const { articles } = await getBlogArticles({
        pagination: { start: pageParam || 0, limit: pageSize },
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

      return articles
    },
    getNextPageParam: (_, pages) => pageSize * pages.length,
    staleTime: 3600,
    cacheTime: 3600,
    initialData: isEmptySearch ? initialData : undefined,
  })

  const articles = useMemo(() => {
    if (!data) {
      return undefined
    }

    return data.pages.flat()
  }, [data])

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
      hasMore={articles.length < meta.total}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Shell>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </Shell>
    </InfiniteScroll>
  )
}
