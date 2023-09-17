import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { GhostArticle } from 'lib/ghost'
import { FC } from 'react'

import { Card } from '../Card'

interface ArticleFooter {
  articles?: GhostArticle[]
}

export const ArticleFooter: FC<ArticleFooter> = ({ articles }) => {
  return (
    <AdditionalArticles title="Similar Articles" className="mt-12 sm:mt-36">
      {articles?.map((a) => (
        <Card key={a.id} article={a} />
      ))}
    </AdditionalArticles>
  )
}
