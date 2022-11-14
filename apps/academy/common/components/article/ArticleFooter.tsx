import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
import { Card } from '../Card'

interface ArticleFooter {
  articles?: ArticleEntity[]
}

export const ArticleFooter: FC<ArticleFooter> = ({ articles }) => {
  return (
    <AdditionalArticles title="Similar Articles" className="mt-12 sm:mt-36">
      {articles?.map((a, i) => (
        <Card key={i} article={a} />
      ))}
    </AdditionalArticles>
  )
}
