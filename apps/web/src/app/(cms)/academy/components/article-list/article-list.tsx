import type { AcademyArticle } from '@sushiswap/graph-client/strapi'
import { ArticleCard } from '../article-card/article-card'

interface ArticleList {
  articles: AcademyArticle[]
  className?: string
}

export function ArticleList({ articles, className }: ArticleList) {
  return (
    <div className={className}>
      {articles.map((article) => (
        <ArticleCard article={article} key={article.slug} />
      ))}
    </div>
  )
}
