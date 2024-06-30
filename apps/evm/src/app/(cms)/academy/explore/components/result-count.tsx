'use client'

import { getAcademyArticles } from '@sushiswap/graph-client/strapi'
import { SkeletonText } from '@sushiswap/ui'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { useAcademySearch } from '../../components/academy-search-provider'

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[120px]">{children}</div>
)

export function ResultCount() {
  const { category, difficulty, search, sorting } = useAcademySearch()

  const { data, isLoading } = useInfiniteQuery<
    Awaited<ReturnType<typeof getAcademyArticles>>
  >({
    queryKey: [
      'academy-articles-infinite',
      { search, category, difficulty, sorting },
    ],
    enabled: false,
  })

  if (isLoading) {
    return (
      <Shell>
        <SkeletonText />
      </Shell>
    )
  }

  return <Shell>{data?.pages[0].meta.total} Results</Shell>
}
