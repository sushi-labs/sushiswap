import { FC, ReactNode } from 'react'

import { ArticleEntity } from '../../.mesh'
import { CardSkeleton } from './Card'

interface ArticleList {
  loading: boolean
  articles: ArticleEntity[]
  render(article: ArticleEntity, index: number): ReactNode
  skeletonAmount?: number
}

export const ArticleList: FC<ArticleList> = ({ articles, loading, render, skeletonAmount }) => {
  if (loading)
    return (
      <>
        {Array.from({ length: skeletonAmount ?? 6 }, (_, i) => i + 1).map((n) => (
          <CardSkeleton key={n} />
        ))}
      </>
    )
  return <>{articles.map((article, i) => render(article, i))}</>
}
