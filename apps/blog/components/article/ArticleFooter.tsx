import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button } from '@sushiswap/ui'
import { format } from 'date-fns'
import { FC } from 'react'
import { Article } from 'types'

interface ArticleFooter {
  articles?: Article[]
}

export const ArticleFooter: FC<ArticleFooter> = ({ articles }) => {
  return (
    <section className="relative pt-16">
      <h2 className="mb-6 text-base font-semibold text-slate-200">Latest articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {articles?.map((article) => (
          <article key={article.id} className="flex flex-col items-start">
            <h3 className="order-1 text-lg font-semibold text-slate-200">{article?.attributes?.title}</h3>
            {article?.attributes?.publishedAt && (
              <time dateTime={article.attributes.publishedAt} className="text-sm leading-7 text-slate-400">
                {format(new Date(article.attributes.publishedAt), 'dd MMM yyyy')}
              </time>
            )}
            <Button
              as="a"
              size="sm"
              color="gray"
              endIcon={<ChevronRightIcon width={16} height={16} />}
              href={`/blog/${article?.attributes?.slug}`}
              className="order-1 mt-6 text-sm"
            >
              Read more
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
