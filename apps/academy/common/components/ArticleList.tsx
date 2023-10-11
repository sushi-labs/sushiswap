import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FC, ReactNode } from 'react'
import { Article } from 'types'

import { Maybe } from '../../.mesh'
import { CardSkeleton } from './Card'

interface ArticleList {
  loading: boolean
  articles: Maybe<Article[]> | undefined
  render(article: Article, index: number): ReactNode
  skeletonAmount?: number
}

export const ArticleList: FC<ArticleList> = ({
  articles,
  loading,
  render,
  skeletonAmount,
}) => {
  if (loading)
    return (
      <>
        {Array.from({ length: skeletonAmount ?? 6 }, (_, i) => i + 1).map(
          (n) => (
            <CardSkeleton key={n} />
          ),
        )}
      </>
    )
  if (!articles?.length)
    return (
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon width={20} height={20} />
        <p className="text-xl font-semibold">No results</p>
      </div>
    )
  return <>{articles.map((article, i) => render(article, i))}</>
}
