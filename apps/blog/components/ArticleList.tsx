import { FC, ReactNode } from 'react'

import { ArticleEntity } from '../.graphclient'
import { CardSkeleton } from './Card'

interface ArticleList {
  loading: boolean
  articles: ArticleEntity[]
  render(article: ArticleEntity): ReactNode
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
