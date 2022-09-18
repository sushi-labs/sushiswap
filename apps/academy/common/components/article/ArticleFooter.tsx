import { AdditionalArticles } from 'common/components/AdditionalArticles'
import { Pane } from 'common/components/Pane'
import { FC } from 'react'

import { ArticleEntity } from '../../../.mesh'
interface ArticleFooter {
  articles?: ArticleEntity[]
}

export const ArticleFooter: FC<ArticleFooter> = ({ articles }) => {
  return (
    <AdditionalArticles title="Similar Articles" className="mt-12 md:mt-36">
      {articles?.map((a, i) => (
        <Pane key={i} article={a} />
      ))}
    </AdditionalArticles>
  )
}
