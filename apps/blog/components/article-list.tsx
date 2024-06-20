import { Article } from 'lib/strapi/article'
import type { FC, ReactNode } from 'react'
import { CardSkeleton } from './card/card-skeleton'

interface ArticleListProps {
  loading: boolean
  articles: Article[]
  render: (article: Article) => ReactNode
}

export const ArticleList: FC<ArticleListProps> = ({
  articles,
  loading,
  render,
}) => {
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
