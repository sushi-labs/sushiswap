import { format } from 'date-fns'
import { FC } from 'react'

import { ArticleEntity } from '../../.graphclient'

interface ArticleHeader {
  article?: ArticleEntity
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-slate-200 md:text-3xl">{article?.attributes?.title}</h1>
      <h3 className="text-lg tracking-tight text-slate-500 mt-1">{article?.attributes?.description}</h3>
      <dl>
        <dt className="sr-only">Date</dt>
        <dd className="absolute inset-x-0 top-0 text-slate-400">
          {article?.attributes?.publishedAt && (
            <time dateTime={article.attributes.publishedAt}>
              {format(new Date(article.attributes.publishedAt), 'EEEE, dd MMM yyyy')}
            </time>
          )}
        </dd>
      </dl>
    </>
  )
}
