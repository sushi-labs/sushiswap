import format from 'date-fns/format'
import { Article } from 'lib/strapi/article'
import type { FC } from 'react'

interface ArticleHeader {
  article: Article
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-slate-200 md:text-3xl">
        {article.title}
      </h1>
      <h3 className="mt-1 text-lg tracking-tight text-slate-500">
        {article.description}
      </h3>
      <dl>
        <dt className="sr-only">Date</dt>
        <dd className="absolute inset-x-0 top-0 text-slate-400">
          {article.publishedAt ? (
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), 'EEEE, dd MMM yyyy')}
            </time>
          ) : null}
        </dd>
      </dl>
    </>
  )
}
