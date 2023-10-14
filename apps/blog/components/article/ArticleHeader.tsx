import { format } from 'date-fns'
import type { FC } from 'react'
import type { Article } from 'types'

interface ArticleHeader {
  article?: Article
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-slate-200 md:text-3xl">
        {article?.attributes.title}
      </h1>
      <h3 className="mt-1 text-lg tracking-tight text-slate-500">
        {article?.attributes.description}
      </h3>
      <dl>
        <dt className="sr-only">Date</dt>
        <dd className="absolute inset-x-0 top-0 text-slate-400">
          {article?.attributes.publishedAt ? <time dateTime={article.attributes.publishedAt}>
              {format(
                new Date(article.attributes.publishedAt),
                'EEEE, dd MMM yyyy',
              )}
            </time> : null}
        </dd>
      </dl>
    </>
  )
}
