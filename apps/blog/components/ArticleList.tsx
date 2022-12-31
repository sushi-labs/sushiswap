import { FC, ReactNode } from 'react'
import { Article } from 'types'

import { CardSkeleton } from './Card'

interface ArticleList {
  loading: boolean
  articles: Article[]
  render(article: Article): ReactNode
}

export const ArticleList: FC<ArticleList> = ({ articles, loading, render }) => {
  if (loading)
    return (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    )

  return <>{articles.map((article) => render(article))}</>
}
