import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { format } from 'date-fns'
import type { FC } from 'react'
import type { Article } from 'types'

interface ArticleFooter {
  articles?: Article[]
}

export const ArticleFooter: FC<ArticleFooter> = ({ articles }) => {
  return (
    <section className="relative pt-16">
      <h2 className="mb-6 text-base font-semibold text-slate-200">
        Latest articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {articles?.map((article) => (
          <article className="flex flex-col items-start" key={article.id}>
            <h3 className="order-1 text-lg font-semibold text-slate-200">
              {article.attributes.title}
            </h3>
            {article.attributes.publishedAt ? (
              <time
                className="text-sm leading-7 text-slate-400"
                dateTime={article.attributes.publishedAt}
              >
                {format(
                  new Date(article.attributes.publishedAt),
                  'dd MMM yyyy',
                )}
              </time>
            ) : null}
            <Button
              asChild
              className="order-1 mt-6"
              size="sm"
              variant="secondary"
            >
              <LinkInternal href={`/${article.attributes.slug}`}>
                Read more
              </LinkInternal>
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
