import type { BlogArticle } from '@sushiswap/graph-client/strapi'
import format from 'date-fns/format'
import type { FC } from 'react'

interface ArticleHeader {
  article: BlogArticle
}

export const ArticleHeader: FC<ArticleHeader> = ({ article }) => {
  return (
    <div>
      <div className="space-y-4">
        <dl className="text-sm">
          <dt className="sr-only">Date</dt>
          <dd className="inset-x-0 top-0 text-slate-400">
            {article.publishedAt ? (
              <time dateTime={article.publishedAt}>
                {format(new Date(article.publishedAt), 'EEEE, dd MMM yyyy')}
              </time>
            ) : null}
          </dd>
        </dl>
        <h1 className="text-2xl font-medium tracking-tight text-slate-200 md:text-3xl">
          {article.title}
        </h1>
      </div>
      <h3 className="mt-1 text-lg tracking-tight text-slate-500">
        {article.description}
      </h3>
    </div>
  )
}
