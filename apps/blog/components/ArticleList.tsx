import { FC } from 'react'

import { Article } from '../types'
import { Card } from './Card'

interface ArticleList {
  articles: Article[]
}

export const ArticleList: FC<ArticleList> = ({ articles }) => {
  return (
    <>
      {articles.map((article) => (
        <Card article={article} key={`article__left__${article.attributes.slug}`} />
      ))}
    </>
  )
}
