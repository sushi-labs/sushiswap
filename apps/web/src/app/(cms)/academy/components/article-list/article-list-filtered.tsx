'use client'

import {
  type AcademyArticle,
  type AcademyArticleMeta,
  getAcademyArticles,
} from '@sushiswap/graph-client/strapi'
import { useIsMounted } from '@sushiswap/hooks'
import { Loader } from '@sushiswap/ui'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAcademySearch } from '../academy-search-provider'
import { ArticleCardLoading } from '../article-card/article-card-loading'
import { ArticleList } from './article-list'

interface ArticleListFiltered {
  initialArticles: AcademyArticle[]
  initialMeta: AcademyArticleMeta
  className?: string
  infinite?: boolean
}

export function ArticleListFiltered({
  initialArticles,
  initialMeta,
  className,
  infinite = false,
}: ArticleListFiltered) {
  const { category, difficulty, search, sorting } = useAcademySearch()

  const isEmptySearch = !(search || category || difficulty || sorting)
  const pageSize = initialArticles.length

  const initialData = useMemo(() => {
    return {
      pageParams: [0],
      pages: [{ articles: initialArticles, meta: initialMeta }],
    }
  }, [initialArticles, initialMeta])

  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.setQueryData(['academy-articles-infinite', {}], initialData)
  }, [queryClient, initialData])

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      'academy-articles-infinite',
      { search, category, difficulty, sorting },
    ],
    queryFn: async ({ pageParam }) => {
      const { articles, meta } = await getAcademyArticles({
        pagination: { start: pageParam, limit: pageSize },
        filters: {
          title: {
            containsi: search,
          },
          or: [
            {
              products: {
                slug: {
                  eq: category,
                },
              },
            },
            {
              topics: {
                slug: {
                  eq: category,
                },
              },
            },
          ],
          difficulty: {
            slug: {
              eq: difficulty,
            },
          },
        },
        sort: sorting ? [sorting] : undefined,
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

    return data.pages.flatMap((page) => page.articles)
  }, [data])

  const meta = data?.pages[0].meta

  const isMounted = useIsMounted()

  if (isLoading || !isMounted) {
    return (
      <div className={className}>
        {Array.from({ length: pageSize }).map((_, index) => (
          <ArticleCardLoading key={index} />
        ))}
      </div>
    )
  }

  if (!articles || isError) {
    return <div>An error has occurred</div>
  }

  if (!articles.length) {
    return <div>No articles found</div>
  }

  return (
    <div className="first:w-full">
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchNextPage}
        hasMore={
          infinite &&
          articles.length < (meta?.total || Number.NEGATIVE_INFINITY)
        }
        loader={
          <div className="flex justify-center w-full py-4">
            <Loader size={16} />
          </div>
        }
        className="!overflow-visible"
      >
        <ArticleList articles={articles} className={className} />
      </InfiniteScroll>
    </div>
  )
}
